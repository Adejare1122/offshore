import { db } from "../db";
import {
    accounts as accountsTable,
    beneficiaries as beneficiariesTable,
    transfers as transfersTable,
    transactions as transactionsTable,
    insertTransferSchema,
} from "../../shared/schema";
import { eq } from "drizzle-orm";

export type CreateTransferInput = {
    userId: number;
    fromAccountId: number | null;
    toAccountId?: number | null;
    beneficiaryId?: number | null;
    beneficiaryName?: string | null;
    beneficiaryAccount?: string | null;
    beneficiaryBank?: string | null;
    routingNumber?: string | null;
    swiftCode?: string | null;
    address?: string | null;
    country?: string | null;
    currency?: string | null;
    amount: number | string;
    description?: string | null;
    transferType: string; // 'LOCAL' | 'WIRE' | 'INTERNAL'
    status?: string; // 'PENDING' | 'COMPLETED' | ...
    fees?: number | string | null;
    scheduledDate?: Date | null;
};

export type CreateWireTransferInput = {
    userId: number;
    fromAccountId: number | null;
    beneficiaryName?: string | null;
    beneficiaryAccount?: string | null;
    beneficiaryBank?: string | null;
    routingNumber?: string | null;
    swiftCode?: string | null;
    address?: string | null;
    country?: string | null;
    amount: number | string;
    description?: string | null;
    transferType: string; // 'LOCAL' | 'WIRE' | 'INTERNAL'
    status?: string; // 'PENDING' | 'COMPLETED' | ...
    fees?: number | string | null;
    scheduledDate?: Date | null;
};

export class TransferService {
    /**
     * Validates inputs and orchestrates a transfer, updating balances and logging transactions.
     * Always creates a row in `transfers`. When a debit account is provided, debits it and logs a transaction.
     * If a destination account is provided, can optionally credit it and log a matching credit transaction.
     */
    static async createTransfer(input: CreateTransferInput) {
        // Normalize and validate using schema
        const validated = {
            userId: Number(input.userId),
            fromAccountId: input.fromAccountId ? Number(input.fromAccountId) : null,
            toAccountId: input.toAccountId ? Number(input.toAccountId) : null,
            beneficiaryId: input.beneficiaryId ? Number(input.beneficiaryId) : null,
            amount: Number(input.amount),
            description: input.description || undefined,
            transferType: input.transferType,
            status: input.status || 'PENDING',
            fees: input.fees != null ? Number(input.fees) : undefined,
            scheduledDate: input.scheduledDate,
        } as any;


        // Create transfer record
        const insertRes = await db.insert(transfersTable).values({ ...validated }).$returningId();
        const transferId = insertRes[0].id as number;
        const [transfer] = await db.select().from(transfersTable).where(eq(transfersTable.id, transferId));

        // If there is a source account, perform debit and log a transaction
        if (validated.fromAccountId && validated.amount) {
            await this.debitAccountAndLog(validated.fromAccountId, validated.amount, validated.transferType, transfer?.reference || `TRF-${transferId}`, validated.description);
        }

        // Optionally: credit destination account and log (only for internal transfers)
        if (validated.toAccountId && validated.transferType === 'INTERNAL') {
            await this.creditAccountAndLog(validated.toAccountId, validated.amount, validated.transferType, transfer?.reference || `TRF-${transferId}`, validated.description);
        }

        return transfer;
    }

    static async createLocalTransfer(input: CreateTransferInput) {
        // Normalize and validate using schema
        const validated = {
            userId: Number(input.userId),
            fromAccountId: input.fromAccountId ? Number(input.fromAccountId) : null,
            beneficiaryName: input.beneficiaryName ?? null,
            beneficiaryAccount: input.beneficiaryAccount ?? null,
            beneficiaryBank: input.beneficiaryBank ?? null,
            routingNumber: input.routingNumber ?? null,
            swiftCode: input.swiftCode ?? null,
            address: input.address ?? null,
            country: input.country ?? null,
            amount: Number(input.amount),
            description: input.description || undefined,
            transferType: input.transferType,
            status: input.status || 'PENDING',
            fees: input.fees != null ? Number(input.fees) : undefined,
            scheduledDate: input.scheduledDate,
        } as any;


        // Create transfer record
        if (validated.fromAccountId && validated.amount) {
            // Fetch the account to get current balance
            const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, validated.fromAccountId));

            const [beneficiary] = await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.id, validated.beneficiaryId));


            if (acc) {
                const current = parseFloat(String(acc.balance || '0'));
                const amount = Number(validated.amount);
                const newBalance = (current - amount).toFixed(2);
                const totalDebit = (parseFloat(String(acc.totalDebit || '0')) + amount).toFixed(2);

                // Insert transaction record
                const result = await db.insert(transactionsTable).values({
                    fromAccountId: validated.fromAccountId,
                    toAccountId: null,
                    transactionType: 'local_transfer',
                    amount: String(amount.toFixed(2)) as any,
                    description: validated.description || 'Local Transfer',
                    status: 'completed',
                    metadata: {
                        local_transfer: true,
                        beneficiary_name: validated.beneficiaryName,
                        beneficiary_account: validated.beneficiaryAccount,
                        beneficiary_bank: validated.beneficiaryBank,
                        swift_code: validated.swiftCode,
                        address: validated.address,
                        country: validated.country,
                        destination_currency: 'USD',
                        destination_amount: amount,
                        fee: validated.fees,
                        intermediary_banks: [],
                        charges: 'OUR', // OUR = sender pays all fees
                        payment_purpose: validated.description || 'Business Payment',
                        compliance_checked: true,
                        estimated_arrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
                    },
                    balance: newBalance,
                    category: 'Transfer',
                    reference: this.generateTransactionReferenceNumber('LTRF-'), // reference will be set after transfer is created
                    createdAt: new Date() as any,
                    completedAt: new Date() as any,
                } as any).$returningId();

                const transactionId = result[0].id as number;
                const [transaction] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, transactionId));

                // Update account balance and totalDebit
                await db.update(accountsTable).set({ balance: newBalance, totalDebit }).where(eq(accountsTable.id, validated.fromAccountId));

                this.scheduleWireStatusChecks(transactionId);

                return transaction as any;
            }
        }

        return null;
    }

    static async createInternalTransfer(input: CreateTransferInput) {
        // Normalize and validate using schema
        const validated = {
            userId: Number(input.userId),
            fromAccountId: input.fromAccountId ? Number(input.fromAccountId) : null,
            toAccountId: input.toAccountId ? Number(input.toAccountId) : null,
            amount: Number(input.amount),
            description: input.description || undefined,
            transferType: input.transferType,
            status: input.status || 'PENDING',
            fees: input.fees != null ? Number(input.fees) : undefined,
            scheduledDate: input.scheduledDate,
        } as any;


        // Create transfer record
        if (validated.fromAccountId && validated.toAccountId && validated.amount) {
            // Fetch the account to get current balance
            const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, validated.fromAccountId));

            const [toAccount] = await db.select().from(accountsTable).where(eq(accountsTable.id, validated.toAccountId));


            if (acc) {
                const current = parseFloat(String(acc.balance || '0'));
                const amount = Number(validated.amount);
                const newBalance = (current - amount).toFixed(2);
                const totalDebit = (parseFloat(String(acc.totalDebit || '0')) + amount).toFixed(2);


                const totalCredit = (parseFloat(String(toAccount.totalCredit || '0')) + amount).toFixed(2);
                const newReceivingBalance = (parseFloat(String(toAccount.balance || '0')) + amount).toFixed(2);

                // Insert transaction record
                const result = await db.insert(transactionsTable).values({
                    fromAccountId: validated.fromAccountId,
                    toAccountId: validated.toAccountId,
                    transactionType: 'internal_transfer',
                    amount: String(amount.toFixed(2)) as any,
                    description: validated.description || 'Internal Transfer',
                    status: 'completed',
                    metadata: {
                        internal_transfer: true,
                        beneficiary_name: toAccount.accountType,
                        beneficiary_account: toAccount.accountNumber,
                        beneficiary_bank: toAccount.accountType,
                        swift_code: toAccount.swiftCode,
                        destination_currency: 'USD',
                        destination_amount: amount,
                        fee: validated.fees,
                        intermediary_banks: [],
                        charges: 'OUR', // OUR = sender pays all fees
                        payment_purpose: validated.description || 'Internal Transfer',
                        compliance_checked: true,
                        estimated_arrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
                    },
                    balance: newBalance,
                    category: 'Transfer',
                    reference: this.generateTransactionReferenceNumber('INTF-'),
                    createdAt: new Date() as any,
                    completedAt: new Date() as any,
                } as any).$returningId();

                const transactionId = result[0].id as number;
                const [transaction] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, transactionId));

                // Update account balance and totalDebit
                await db.update(accountsTable).set({ balance: newBalance, totalDebit }).where(eq(accountsTable.id, validated.fromAccountId));

                // Update receiving account balance and totalCredit
                await db.update(accountsTable).set({ balance: newReceivingBalance, totalCredit }).where(eq(accountsTable.id, validated.toAccountId));

                this.scheduleWireStatusChecks(transactionId);

                return transaction as any;
            }
        }

        return null;
    }

    static async createWireTransfer(input: CreateWireTransferInput) {
        // Normalize and validate using schema
        const validated = {
            userId: Number(input.userId),
            fromAccountId: input.fromAccountId ? Number(input.fromAccountId) : null,
            beneficiaryName: input.beneficiaryName ?? null,
            beneficiaryAccount: input.beneficiaryAccount ?? null,
            beneficiaryBank: input.beneficiaryBank ?? null,
            routingNumber: input.routingNumber ?? null,
            swiftCode: input.swiftCode ?? null,
            address: input.address ?? null,
            country: input.country ?? null,
            amount: Number(input.amount),
            description: input.description || undefined,
            transferType: input.transferType,
            status: input.status || 'PENDING',
            fees: input.fees != null ? Number(input.fees) : undefined,
            scheduledDate: input.scheduledDate,
        } as any;


        // Create transfer record
        // For wire transfers, log a transaction for the debit from the source account
        if (validated.fromAccountId && validated.amount) {
            // Fetch the account to get current balance
            const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, validated.fromAccountId));
            if (acc) {
                const current = parseFloat(String(acc.balance || '0'));
                const amount = Number(validated.amount);
                const newBalance = (current - amount).toFixed(2);
                const totalDebit = (parseFloat(String(acc.totalDebit || '0')) + amount).toFixed(2);

                // Insert transaction record
                const result = await db.insert(transactionsTable).values({
                    fromAccountId: validated.fromAccountId,
                    toAccountId: null,
                    transactionType: 'wire_transfer',
                    amount: String(amount.toFixed(2)) as any,
                    description: validated.description || 'Wire Transfer',
                    status: 'pending',
                    metadata: {
                        wire_transfer: true,
                        beneficiary_name: validated.beneficiaryName,
                        beneficiary_account: validated.beneficiaryAccount,
                        beneficiary_bank: validated.beneficiaryBank,
                        swift_code: validated.swiftCode,
                        destination_currency: validated.currency ?? 'USD',
                        destination_amount: amount,
                        fee: validated.fees,
                        intermediary_banks: [],
                        charges: 'OUR', // OUR = sender pays all fees
                        payment_purpose: validated.description || 'Business Payment',
                        compliance_checked: true,
                        estimated_arrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
                    },
                    balance: newBalance,
                    category: 'Transfer',
                    reference: this.generateTransactionReferenceNumber('WTRF-'), // reference will be set after transfer is created
                    createdAt: new Date() as any,
                    completedAt: new Date() as any,
                } as any).$returningId();

                const transactionId = result[0].id as number;
                const [transaction] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, transactionId));

                // Update account balance and totalDebit
                await db.update(accountsTable).set({ balance: newBalance, totalDebit }).where(eq(accountsTable.id, validated.fromAccountId));

                this.scheduleWireStatusChecks(transactionId);

                return transaction as any;
            }
        }

        return null;
    }

    private static generateTransactionReferenceNumber(prefix: string) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    private static scheduleWireStatusChecks(transactionId: number) {
        // Schedule status checks every 6 hours
        const checkInterval = setInterval(async () => {
            try {
                const [transaction] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, transactionId));
                if (transaction.status === 'completed' || transaction.status === 'failed') {
                    clearInterval(checkInterval);
                    return;
                }

                // Mock status update
                // if (Math.random() > 0.7) { // 30% chance of completion each check
                await db.update(transactionsTable).set({
                    status: 'completed',
                    completedAt: new Date()
                }).where(eq(transactionsTable.id, transactionId));
                clearInterval(checkInterval);
                // }
            } catch (error) {
                console.error('Wire status check error:', error);
            }
        }, 6 * 60 * 60 * 1000); // 6 hours
    }

    private static async debitAccountAndLog(accountId: number, amountNum: number, transferType: string, reference: string, description?: string) {
        const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, accountId));
        if (!acc) return;
        const current = parseFloat(String(acc.balance || '0'));
        const amount = Number(amountNum);
        const newBalance = (current - amount).toFixed(2);
        const totalDebit = (parseFloat(String(acc.totalDebit || '0')) + amount).toFixed(2);
        await db.update(accountsTable).set({ balance: newBalance, totalDebit }).where(eq(accountsTable.id, accountId));
        await db.insert(transactionsTable).values({
            fromAccountId: accountId,
            toAccountId: null,
            transactionType: transferType === 'LOCAL' ? 'local_transfer' : transferType === 'WIRE' ? 'wire_transfer' : 'internal_transfer',
            amount: String(amount.toFixed(2)) as any,
            description: description || `${transferType} TRANSFER`,
            status: 'completed',
            metadata: null as any,
            balance: newBalance,
            category: 'Transfer',
            reference,
            createdAt: new Date() as any,
            completedAt: new Date() as any,
        } as any);
    }

    private static async creditAccountAndLog(accountId: number, amountNum: number, transferType: string, reference: string, description?: string) {
        const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, accountId));
        if (!acc) return;
        const current = parseFloat(String(acc.balance || '0'));
        const amount = Number(amountNum);
        const newBalance = (current + amount).toFixed(2);
        const totalCredit = (parseFloat(String(acc.totalCredit || '0')) + amount).toFixed(2);
        await db.update(accountsTable).set({ balance: newBalance, totalCredit }).where(eq(accountsTable.id, accountId));
        await db.insert(transactionsTable).values({
            fromAccountId: null,
            toAccountId: accountId,
            transactionType: transferType === 'LOCAL' ? 'local_transfer' : transferType === 'WIRE' ? 'wire_transfer' : 'internal_transfer',
            amount: String(amount.toFixed(2)) as any,
            description: description || `${transferType} TRANSFER CREDIT`,
            status: 'completed',
            metadata: null as any,
            balance: newBalance,
            category: 'Transfer',
            reference,
            createdAt: new Date() as any,
            completedAt: new Date() as any,
        } as any);
    }
}


