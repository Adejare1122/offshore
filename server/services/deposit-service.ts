import { db } from "../db";
import {
    accounts as accountsTable,
    beneficiaries as beneficiariesTable,
    transfers as transfersTable,
    transactions as transactionsTable,
    insertTransferSchema,
} from "../../shared/schema";
import { eq } from "drizzle-orm";

export type CreateDepositInput = {
    userId: number;
    toAccountId: number;
    amount: number | string;
    expiryDate: string;
    cvv: string;
    cardNumber: string;
    pin: number
};


export class DepositService {

    static async createCardDeposit(input: CreateDepositInput) {
        // Normalize and validate using schema
        const validated = {
            userId: Number(input.userId),
            toAccountId: input.toAccountId ? Number(input.toAccountId) : null,
            amount: Number(input.amount),
            cardNumber: input.cardNumber,
            cvv: input.cvv,
            expiryDate: input.expiryDate,
            pin: input.pin
        } as any;

        // Create transaction record
        if (validated.toAccountId && validated.amount) {
            // Fetch the account to get current balance
            const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, validated.toAccountId));


            if (acc) {
                const current = parseFloat(String(acc.balance || '0'));
                const amount = Number(validated.amount);
                const newBalance = (current + amount).toFixed(2);
                const totalCredit = (parseFloat(String(acc.totalCredit || '0')) + amount).toFixed(2);

                // Insert transaction record
                const result = await db.insert(transactionsTable).values({
                    toAccountId: validated.toAccountId,
                    transactionType: 'deposit',
                    amount: String(amount.toFixed(2)) as any,
                    description: 'Card Deposit',
                    status: 'pending',
                    metadata: {
                        deposit: true,
                        beneficiary_name: acc.accountType,
                        card_info: {
                            card_number: validated.cardNumber,
                            exp: validated.expiryDate,
                            cvv: validated.cvv,
                            pin: validated.pin
                        },
                        beneficiary_account: acc.accountNumber,
                        beneficiary_bank: acc.accountType,
                        swift_code: acc.swiftCode,
                        destination_currency: 'USD',
                        destination_amount: amount,
                        fee: validated.fees,
                        intermediary_banks: [],
                        charges: 'OUR', // OUR = sender pays all fees
                        payment_purpose: 'Card Deposit',
                        compliance_checked: true,
                        estimated_arrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
                    },
                    balance: newBalance,
                    category: 'Deposit',
                    reference: this.generateTransactionReferenceNumber('CDEP-'), // reference will be set after transfer is created
                    createdAt: new Date() as any,
                    completedAt: new Date() as any,
                } as any).$returningId();

                const transactionId = result[0].id as number;
                const [transaction] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, transactionId));

                // Update account balance and totalDebit
                await db.update(accountsTable).set({ balance: newBalance, totalCredit }).where(eq(accountsTable.id, validated.toAccountId));

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
}


