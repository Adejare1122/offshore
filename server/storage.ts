import {
  users, accounts, beneficiaries, transactions, creditCards, transfers, bills, loans, investments, notifications,
  type User, type Account, type Beneficiary, type Transaction, type CreditCard, type Transfer, type Bill, type Loan, type Investment, type Notification,
  type InsertUser, type InsertAccount, type InsertBeneficiary, type InsertTransaction, type InsertCreditCard, type InsertTransfer, type InsertBill, type InsertLoan, type InsertInvestment, type InsertNotification
} from "../shared/schema";
import { db, qdb } from "./db";
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Account operations
  getUserAccounts(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccountBalance(accountId: number, balance: string): Promise<Account>;

  // Beneficiary operations
  getUserBeneficiaries(userId: number): Promise<Beneficiary[]>;
  getBeneficiary(id: number): Promise<Beneficiary | undefined>;
  createBeneficiary(beneficiary: InsertBeneficiary): Promise<Beneficiary>;
  deleteBeneficiary(id: number): Promise<void>;

  // Transaction operations
  getAccountTransactions(accountId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Credit card operations
  getUserCreditCards(userId: number): Promise<CreditCard[]>;
  getCreditCard(id: number): Promise<CreditCard | undefined>;
  createCreditCard(creditCard: InsertCreditCard): Promise<CreditCard>;

  // Transfer operations
  getUserTransfers(userId: number, type?: string): Promise<Transfer[]>;
  getTransfer(id: number): Promise<Transfer | undefined>;
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;
  updateTransferStatus(id: number, status: string, completedAt?: Date): Promise<Transfer>;

  // Bill operations
  getUserBills(userId: number): Promise<Bill[]>;
  getBill(id: number): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBillStatus(id: number, status: string): Promise<Bill>;
  deleteBill(id: number): Promise<void>;

  // Loan operations
  getUserLoans(userId: number): Promise<Loan[]>;
  getLoan(id: number): Promise<Loan | undefined>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoanBalance(id: number, balance: string): Promise<Loan>;

  // Investment operations
  getUserInvestments(userId: number): Promise<Investment[]>;
  getInvestment(id: number): Promise<Investment | undefined>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestmentPrice(id: number, currentPrice: string, totalValue: string, gainLoss: string): Promise<Investment>;

  // Notification operations
  getUserNotifications(userId: number): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  deleteNotification(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({ ...insertUser }).$returningId();
    const id = result[0].id;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user as User;
  }

  // Account operations
  async getUserAccounts(userId: number): Promise<Account[]> {
    return await db.select().from(accounts).where(eq(accounts.userId, userId));
  }

  async getAccount(id: number): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account || undefined;
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const result = await db.insert(accounts).values({ ...insertAccount }).$returningId();
    const id = result[0].id;
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account as Account;
  }

  async updateAccountBalance(accountId: number, balance: string): Promise<Account> {
    await db.update(accounts).set({ balance }).where(eq(accounts.id, accountId));
    const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));
    return account as Account;
  }

  // Beneficiary operations
  async getUserBeneficiaries(userId: number): Promise<Beneficiary[]> {
    return await db.select().from(beneficiaries).where(eq(beneficiaries.userId, userId));
  }

  async getBeneficiary(id: number): Promise<Beneficiary | undefined> {
    const [beneficiary] = await db.select().from(beneficiaries).where(eq(beneficiaries.id, id));
    return beneficiary || undefined;
  }

  async createBeneficiary(insertBeneficiary: InsertBeneficiary): Promise<Beneficiary> {
    const result = await db.insert(beneficiaries).values({ ...insertBeneficiary }).$returningId();
    const id = result[0].id;
    const [beneficiary] = await db.select().from(beneficiaries).where(eq(beneficiaries.id, id));
    return beneficiary as Beneficiary;
  }

  async deleteBeneficiary(id: number): Promise<void> {
    await db.delete(beneficiaries).where(eq(beneficiaries.id, id));
  }

  // Transaction operations
  async getAccountTransactions(accountId: number): Promise<Transaction[]> {
    const aid = Number(accountId);
    const toAcc = alias(accounts, 'to_acc');
    const toUser = alias(users, 'to_user');

    const rows = await db
      .select({
        // base transaction fields
        id: transactions.id,
        toAccountId: transactions.toAccountId,
        fromAccountId: transactions.fromAccountId,
        transactionType: transactions.transactionType,
        amount: transactions.amount,
        description: transactions.description,
        status: transactions.status,
        metadata: transactions.metadata,
        balance: transactions.balance,
        category: transactions.category,
        reference: transactions.reference,
        createdAt: transactions.createdAt,
        completedAt: transactions.completedAt,
        // from account + user
        fromAccountNumber: accounts.accountNumber,
        fromAccountType: accounts.accountType,
        fromUserId: accounts.userId,
        fromUserFirstName: users.firstName,
        fromUserLastName: users.lastName,
        // to account + user
        toAccountNumber: toAcc.accountNumber,
        toAccountType: toAcc.accountType,
        toUserId: toAcc.userId,
        toUserFirstName: toUser.firstName,
        toUserLastName: toUser.lastName,
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.fromAccountId, accounts.id))
      .leftJoin(users, eq(accounts.userId, users.id))
      .leftJoin(toAcc, eq(transactions.toAccountId, toAcc.id))
      .leftJoin(toUser, eq(toAcc.userId, toUser.id))
      .where(or(eq(transactions.fromAccountId, aid), eq(transactions.toAccountId, aid)))
      .orderBy(desc(transactions.createdAt));

    // Map joined details into metadata to preserve Transaction shape
    const result: Transaction[] = rows.map((r: any) => ({
      id: r.id,
      toAccountId: r.toAccountId,
      fromAccountId: r.fromAccountId,
      transactionType: r.transactionType,
      amount: r.amount,
      description: r.description,
      status: r.status,
      metadata: {
        ...(r.metadata || {}),
        fromAccount: r.fromAccountNumber ? {
          id: r.fromAccountId,
          number: r.fromAccountNumber,
          type: r.fromAccountType,
          user: {
            id: r.fromUserId,
            firstName: r.fromUserFirstName,
            lastName: r.fromUserLastName,
          }
        } : undefined,
        toAccount: r.toAccountNumber ? {
          id: r.toAccountId,
          number: r.toAccountNumber,
          type: r.toAccountType,
          user: {
            id: r.toUserId,
            firstName: r.toUserFirstName,
            lastName: r.toUserLastName,
          }
        } : undefined,
      },
      balance: r.balance,
      category: r.category,
      reference: r.reference,
      createdAt: r.createdAt,
      completedAt: r.completedAt,
    } as Transaction));

    return result;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values({ ...insertTransaction }).$returningId();
    const id = result[0].id;
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction as Transaction;
  }

  // Credit card operations
  async getUserCreditCards(userId: number): Promise<CreditCard[]> {
    const userAccounts = await db.select().from(accounts).where(eq(accounts.userId, userId));
    const accountIds = userAccounts.map(a => a.id);
    if (accountIds.length === 0) return [];
    return await db.select().from(creditCards).where(inArray(creditCards.accountId, accountIds));
  }

  async getCreditCard(id: number): Promise<CreditCard | undefined> {
    const [creditCard] = await db.select().from(creditCards).where(eq(creditCards.id, id));
    return creditCard || undefined;
  }

  async createCreditCard(insertCreditCard: InsertCreditCard): Promise<CreditCard> {
    const result = await db.insert(creditCards).values({ ...insertCreditCard }).$returningId();
    const id = result[0].id;
    const [creditCard] = await db.select().from(creditCards).where(eq(creditCards.id, id));
    return creditCard as CreditCard;
  }

  // Transfer operations
  async getUserTransfers(userId: number, type?: string): Promise<Transfer[]> {
    if (type) {
      return await db
        .select()
        .from(transfers)
        .where(and(eq(transfers.userId, userId), eq(transfers.transferType, type)));
    }
    return await db.select().from(transfers).where(eq(transfers.userId, userId));
  }

  async getTransfer(id: number): Promise<Transfer | undefined> {
    const [transfer] = await db.select().from(transfers).where(eq(transfers.id, id));
    return transfer || undefined;
  }

  async createTransfer(insertTransfer: InsertTransfer): Promise<Transfer> {
    // Insert transfer first
    const result = await db.insert(transfers).values({ ...insertTransfer }).$returningId();
    const id = result[0].id;
    const [transfer] = await db.select().from(transfers).where(eq(transfers.id, id));

    // Best-effort account balance update and transaction log
    try {
      if (insertTransfer.fromAccountId && insertTransfer.amount) {
        const fromId = Number(insertTransfer.fromAccountId);
        const [fromAccount] = await db.select().from(accounts).where(eq(accounts.id, fromId));
        if (fromAccount) {
          const oldBalance = parseFloat(String(fromAccount.balance || '0'));
          const amount = parseFloat(String(insertTransfer.amount));
          const newBalance = (oldBalance - amount);
          const oldDebit = parseFloat(String(fromAccount.totalDebit || '0'));
          const newDebit = oldDebit + amount;
          await db.update(accounts).set({
            balance: String(newBalance.toFixed(2)),
            totalDebit: String(newDebit.toFixed(2)),
          }).where(eq(accounts.id, fromId));

          // Create a matching debit transaction record
          const nowStr = new Date().toLocaleDateString();
          await db.insert(transactions).values({
            accountId: fromId,
            type: 'DEBIT',
            amount: String(amount.toFixed(2)) as any,
            description: insertTransfer.description || `${insertTransfer.transferType} TRANSFER`,
            date: nowStr,
            balance: String(newBalance.toFixed(2)),
            category: 'Transfer',
            reference: (transfer as any).reference || `TRF-${id}`,
          } as any);
        }
      }
    } catch (e) {
      // Do not fail the transfer creation if bookkeeping fails; log in server
      // eslint-disable-next-line no-console
      console.error('Failed to update balance/transactions for transfer', e);
    }

    return transfer as Transfer;
  }

  async updateTransferStatus(id: number, status: string, completedAt?: Date): Promise<Transfer> {
    await db.update(transfers).set({ status, completedAt }).where(eq(transfers.id, id));
    const [transfer] = await db.select().from(transfers).where(eq(transfers.id, id));
    return transfer as Transfer;
  }

  // Bill operations
  async getUserBills(userId: number): Promise<Bill[]> {
    return await db.select().from(bills).where(eq(bills.userId, userId));
  }

  async getBill(id: number): Promise<Bill | undefined> {
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill || undefined;
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const result = await db.insert(bills).values({ ...insertBill }).$returningId();
    const id = result[0].id;
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill as Bill;
  }

  async updateBillStatus(id: number, status: string): Promise<Bill> {
    await db.update(bills).set({ status }).where(eq(bills.id, id));
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill as Bill;
  }

  async deleteBill(id: number): Promise<void> {
    await db.delete(bills).where(eq(bills.id, id));
  }

  // Loan operations
  async getUserLoans(userId: number): Promise<Loan[]> {
    return await db.select().from(loans).where(eq(loans.userId, userId));
  }

  async getLoan(id: number): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan || undefined;
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const result = await db.insert(loans).values({ ...insertLoan }).$returningId();
    const id = result[0].id;
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan as Loan;
  }

  async updateLoanBalance(id: number, balance: string): Promise<Loan> {
    await db.update(loans).set({ currentBalance: balance }).where(eq(loans.id, id));
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan as Loan;
  }

  // Investment operations
  async getUserInvestments(userId: number): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.userId, userId));
  }

  async getInvestment(id: number): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment || undefined;
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const result = await db.insert(investments).values({ ...insertInvestment }).$returningId();
    const id = result[0].id;
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment as Investment;
  }

  async updateInvestmentPrice(id: number, currentPrice: string, totalValue: string, gainLoss: string): Promise<Investment> {
    await db.update(investments).set({ currentPrice, totalValue, gainLoss }).where(eq(investments.id, id));
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment as Investment;
  }

  // Notification operations
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || undefined;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values({ ...insertNotification }).$returningId();
    const id = result[0].id;
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification as Notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    await db.update(notifications).set({ isRead: 'true' }).where(eq(notifications.id, id));
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification as Notification;
  }

  async deleteNotification(id: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();