import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertAccountSchema, insertBeneficiarySchema, insertTransactionSchema, insertCreditCardSchema,
  insertTransferSchema, insertBillSchema, insertLoanSchema, insertInvestmentSchema, insertNotificationSchema,
  insertApplicationSchema, applications, users as usersTable, accounts as accountsTable, countries, states, users,
  transfers as transfersTable, bills as billsTable, transactions as transactionsTable, beneficiaries as beneficiariesTable, notifications as notificationsTable,
  creditCards
} from "../shared/schema";
import { db } from "./db";
import { eq, and, sql, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin, requireAuth } from "./auth";
import { TransferService } from "./services/transfer-service";
import { DepositService } from "./services/deposit-service";

function generateAccountId(prefix: string): string {
  const suffix = Math.floor(1_000_000_000 + Math.random() * 8_999_999_999).toString();
  return `${prefix}${suffix}`.slice(0, 16);
}

function generateAccountNumber(): string {
  const suffix = Math.floor(1_000_000_000 + Math.random() * 8_999_999_999).toString();
  // return `${prefix}${suffix}`.slice(0, 16);
  return `${suffix}`.slice(0, 10);

}

async function generateUnique8DigitUsername(): Promise<string> {
  // Get the highest existing username and increment by 1
  const [lastUser] = await db.select({ username: users.username })
    .from(users)
    .where(sql`${users.username} REGEXP '^[0-9]{7}$'`)
    .orderBy(sql`CAST(${users.username} AS UNSIGNED) DESC`)
    .limit(1);

  let nextNumber = 5517195; // Starting sequence
  if (lastUser && /^\d{7}$/.test(lastUser.username)) {
    nextNumber = parseInt(lastUser.username) + 1;
  }

  return nextNumber.toString();
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Get user accounts
  app.get("/api/accounts/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const accounts = await storage.getUserAccounts(Number(userId));
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch accounts", error: error.message });
    }
  });

  // Create new account
  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(validatedData);
      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid account data", error: error.message });
    }
  });

  // Get user beneficiaries
  app.get("/api/beneficiaries/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const beneficiaries = await storage.getUserBeneficiaries(Number(userId));
      res.json(beneficiaries);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch beneficiaries", error: error.message });
    }
  });

  // Create new beneficiary
  app.post("/api/beneficiaries", async (req, res) => {
    try {
      const validatedData = insertBeneficiarySchema.parse(req.body);
      const beneficiary = await storage.createBeneficiary(validatedData);
      res.status(201).json(beneficiary);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid beneficiary data", error: error.message });
    }
  });

  // Delete beneficiary
  app.delete("/api/beneficiaries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBeneficiary(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete beneficiary", error: error.message });
    }
  });

  // Get account transactions
  app.get("/api/transactions/:accountId", async (req, res) => {
    try {
      const { accountId } = req.params;
      const transactions = await storage.getAccountTransactions(Number(accountId));
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
    }
  });

  // Create new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid transaction data", error: error.message });
    }
  });

  // Get user credit cards (by joining through accounts)
  app.get("/api/credit-cards/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const creditCards = await storage.getUserCreditCards(Number(userId));
      res.json(creditCards);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch credit cards", error: error.message });
    }
  });

  // Create new credit card
  app.post("/api/credit-cards", async (req, res) => {
    try {
      const validatedData = insertCreditCardSchema.parse(req.body);
      const creditCard = await storage.createCreditCard(validatedData);
      res.status(201).json(creditCard);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid credit card data", error: error.message });
    }
  });

  // Update credit card
  app.patch("/api/credit-cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { cardNumber, cardholderName, expiryMonth, expiryYear, cardType, creditLimit, currentBalance, isActive } = req.body;

      const updateData: any = {};
      if (cardNumber !== undefined) updateData.cardNumber = cardNumber;
      if (cardholderName !== undefined) updateData.cardholderName = cardholderName;
      if (expiryMonth !== undefined) updateData.expiryMonth = expiryMonth;
      if (expiryYear !== undefined) updateData.expiryYear = expiryYear;
      if (cardType !== undefined) updateData.cardType = cardType;
      if (creditLimit !== undefined) updateData.creditLimit = creditLimit;
      if (currentBalance !== undefined) updateData.currentBalance = currentBalance;
      if (isActive !== undefined) updateData.isActive = isActive;

      await db.update(creditCards).set(updateData).where(eq(creditCards.id, Number(id)));
      const [card] = await db.select().from(creditCards).where(eq(creditCards.id, Number(id)));
      res.json(card);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update credit card", error: error.message });
    }
  });

  // Delete credit card
  app.delete("/api/credit-cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(creditCards).where(eq(creditCards.id, Number(id)));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete credit card", error: error.message });
    }
  });

  // PIN endpoints
  app.post("/api/users/:userId/pin", async (req, res) => {
    try {
      const { userId } = req.params as any;
      const { pin } = req.body as { pin: string };
      if (!pin || String(pin).length < 4) return res.status(400).json({ message: "PIN must be at least 4 digits" });
      const hash = bcrypt.hashSync(String(pin), 12);
      await db.update(usersTable).set({ pinHash: hash }).where(eq(usersTable.id, Number(userId)));
      res.json({ ok: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to set PIN", error: error.message });
    }
  });

  app.post("/api/users/:userId/verify-pin", async (req, res) => {
    try {
      const { userId } = req.params as any;
      const { pin } = req.body as { pin: string };
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(userId)));
      if (!user?.pinHash) return res.status(404).json({ message: "PIN not set" });
      const ok = bcrypt.compareSync(String(pin), String((user as any).pinHash));
      if (!ok) return res.status(401).json({ message: "Invalid PIN" });
      res.json({ ok: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to verify PIN", error: error.message });
    }
  });

  // Update user profile
  app.patch("/api/users/:id", requireAuth as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const { firstName, lastName, email, phone, password } = req.body as any;

      // Ensure user can only update their own profile
      if (Number(id) !== Number(req.session.user?.id)) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }

      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (password !== undefined && password.trim() !== '') {
        updateData.password = bcrypt.hashSync(password, 12);
      }

      await db.update(usersTable).set(updateData).where(eq(usersTable.id, Number(id)));
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(id)));

      req.session.user = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        // @ts-ignore
        role: (user as any).role || 'USER',
      };

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
  });

  // Update account balance
  app.patch("/api/accounts/:id/balance", async (req, res) => {
    try {
      const { id } = req.params;
      const { balance } = req.body;
      const account = await storage.updateAccountBalance(Number(id), balance);
      res.json(account);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update account balance", error: error.message });
    }
  });

  // Transfer routes
  app.get("/api/transfers/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { type } = req.query as { type?: string };
      const transfers = await storage.getUserTransfers(Number(userId), type);
      res.json(transfers);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch transfers", error: error.message });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const body = req.body as any;
      const transfer = await TransferService.createTransfer({
        userId: Number(body.userId),
        fromAccountId: body.fromAccountId != null ? Number(body.fromAccountId) : null,
        toAccountId: body.toAccountId != null ? Number(body.toAccountId) : null,
        beneficiaryId: body.beneficiaryId != null ? Number(body.beneficiaryId) : null,
        amount: Number(body.amount),
        description: body.description,
        transferType: String(body.transferType || body.type || 'LOCAL'),
        status: body.status,
        fees: body.fees,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
      });
      res.status(201).json(transfer);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid transfer data: " + error.message, error: error.message });
    }
  });

  app.post("/api/transfers/wire", async (req, res) => {
    try {
      const body = req.body as any;


      const transfer = await TransferService.createWireTransfer({
        userId: Number(body.userId),
        fromAccountId: body.fromAccountId != null ? Number(body.fromAccountId) : null,
        beneficiaryName: body.beneficiaryName ?? null,
        beneficiaryAccount: body.beneficiaryAccount ?? null,
        beneficiaryBank: body.beneficiaryBank ?? null,
        routingNumber: body.routingNumber ?? null,
        swiftCode: body.swiftCode ?? null,
        address: body.address ?? null,
        country: body.country ?? null,
        amount: Number(body.amount),
        description: body.description,
        transferType: 'wire_transfer',
        status: body.status,
        fees: body.fees,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
      });

      res.status(201).json(transfer);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid transfer data: " + error.message, error: error.message });
    }
  });

  app.post("/api/transfers/local", async (req, res) => {
    try {
      const body = req.body as any;
      console.log(body);

      const transfer = await TransferService.createLocalTransfer({
        userId: Number(body.userId),
        fromAccountId: body.fromAccountId != null ? Number(body.fromAccountId) : null,
        beneficiaryId: body.beneficiaryId ?? null,
        amount: Number(body.amount),
        description: body.description,
        transferType: 'local_transfer',
        status: body.status,
        fees: body.fees,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
      });

      res.status(201).json(transfer);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid transfer data: " + error.message, error: error.message });
    }
  });

  app.post("/api/transfers/internal", async (req, res) => {
    try {
      const body = req.body as any;
      console.log(body);

      const transfer = await TransferService.createInternalTransfer({
        userId: Number(body.userId),
        fromAccountId: body.fromAccountId != null ? Number(body.fromAccountId) : null,
        toAccountId: body.toAccountId != null ? Number(body.toAccountId) : null,
        amount: Number(body.amount),
        description: body.remarks,
        transferType: 'internal_transfer',
        status: body.status,
        fees: body.fees,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
      });

      res.status(201).json(transfer);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid transfer data: " + error.message, error: error.message });
    }
  });

  app.post("/api/deposits/card", async (req, res) => {
    try {
      const body = req.body as any;
      console.log(body);

      const deposit = await DepositService.createCardDeposit({
        userId: Number(body.userId),
        toAccountId: Number(body.toAccountId),
        amount: Number(body.amount),
        cardNumber: body.cardNumber,
        cvv: body.cvv,
        expiryDate: body.expiryDate,
        pin: body.pin
      });

      res.status(201).json(deposit);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid deposit data: " + error.message, error: error.message });
    }
  });
  // ===== Admin endpoints =====
  // Basic caution: add your own authentication/authorization for admins in production.

  // Users list and update
  app.get("/api/admin/users", requireAdmin as any, async (req, res) => {
    try {
      const { limit = '25', offset = '0' } = req.query as any;
      const all = await db.select().from(usersTable).limit(Number(limit)).offset(Number(offset));
      res.json(all);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load users", error: e.message });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const { firstName, lastName, email, phone, kyc_status, role, password } = req.body as any;

      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (kyc_status !== undefined) updateData.kyc_status = kyc_status;
      if (role !== undefined) updateData.role = role;
      if (password && password.trim() !== '') {
        updateData.password = bcrypt.hashSync(password, 12);
      }

      await db.update(usersTable).set(updateData).where(eq(usersTable.id, Number(id)));
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(id)));
      res.json(user);
    } catch (e: any) {
      res.status(400).json({ message: "Failed to update user", error: e.message });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      await db.delete(usersTable).where(eq(usersTable.id, Number(id)));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ message: "Failed to delete user", error: e.message });
    }
  });

  app.get("/api/admin/users/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(id)));
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load user", error: e.message });
    }
  });

  // Applications approve/reject
  app.get("/api/admin/applications", requireAdmin as any, async (req, res) => {
    try {
      const { limit = '25', offset = '0' } = req.query as any;
      const all = await db.select().from(applications).limit(Number(limit)).offset(Number(offset));
      res.json(all);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load applications", error: e.message });
    }
  });

  app.patch("/api/admin/applications/:id/status", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const { status } = req.body as { status: string };
      await db.update(applications).set({ status }).where(eq(applications.id, Number(id)));
      const [row] = await db.select().from(applications).where(eq(applications.id, Number(id)));
      res.json(row);
    } catch (e: any) {
      res.status(400).json({ message: "Failed to update application status", error: e.message });
    }
  });

  // Accounts admin
  app.get("/api/admin/accounts", requireAdmin as any, async (req, res) => {
    try {
      const { limit = '25', offset = '0' } = req.query as any;
      const rows = await db.select().from(accountsTable).limit(Number(limit)).offset(Number(offset));
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load accounts", error: e.message });
    }
  });

  app.get("/api/admin/users/:id/accounts", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const rows = await db.select().from(accountsTable).where(eq(accountsTable.userId, Number(id)));
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load user accounts", error: e.message });
    }
  });

  app.patch("/api/admin/accounts/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const { balance, accountType, accountNumber } = req.body as any;
      await db.update(accountsTable).set({ balance, accountType, accountNumber }).where(eq(accountsTable.id, Number(id)));
      const [row] = await db.select().from(accountsTable).where(eq(accountsTable.id, Number(id)));
      res.json(row);
    } catch (e: any) {
      res.status(400).json({ message: "Failed to update account", error: e.message });
    }
  });

  app.post("/api/admin/accounts/:id/topup", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const { amount } = req.body as { amount: string };
      const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, Number(id)));
      if (!acc) return res.status(404).json({ message: "Account not found" });
      const current = parseFloat(String(acc.balance || '0'));
      const delta = parseFloat(String(amount));
      const newBalance = (current + delta).toFixed(2);
      await db.update(accountsTable).set({ balance: newBalance }).where(eq(accountsTable.id, Number(id)));
      const [row] = await db.select().from(accountsTable).where(eq(accountsTable.id, Number(id)));
      res.json(row);
    } catch (e: any) {
      res.status(400).json({ message: "Failed to top up account", error: e.message });
    }
  });

  app.delete("/api/admin/accounts/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      await db.delete(accountsTable).where(eq(accountsTable.id, Number(id)));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ message: "Failed to delete account", error: e.message });
    }
  });

  // Transfers admin
  app.get("/api/admin/transfers", requireAdmin as any, async (req, res) => {
    try {
      const { limit = '25', offset = '0' } = req.query as any;
      const rows = await db.select().from(transfersTable).limit(Number(limit)).offset(Number(offset));
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load transfers", error: e.message });
    }
  });

  app.get("/api/admin/transfers/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const [row] = await db.select().from(transfersTable).where(eq(transfersTable.id, Number(id)));
      if (!row) return res.status(404).json({ message: "Transfer not found" });
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, row.userId));
      const [fromAcc] = row.fromAccountId ? await db.select().from(accountsTable).where(eq(accountsTable.id, Number(row.fromAccountId))) : [undefined];
      const [toAcc] = row.toAccountId ? await db.select().from(accountsTable).where(eq(accountsTable.id, Number(row.toAccountId))) : [undefined];
      const [beneficiary] = row.beneficiaryId ? await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.id, Number(row.beneficiaryId))) : [undefined];
      res.json({ ...row, user, fromAccount: fromAcc, toAccount: toAcc, beneficiary });
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load transfer", error: e.message });
    }
  });

  // Admin: Create manual transfer
  app.post("/api/admin/transfers", requireAdmin as any, async (req, res) => {
    try {
      const { userId, fromAccountId, toAccountId, amount, description, type, beneficiaryId } = req.body as any;

      if (!userId || !amount || !description || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!['LOCAL', 'WIRE', 'INTERNAL'].includes(String(type))) {
        return res.status(400).json({ message: "Invalid transfer type" });
      }

      const transfer = await TransferService.createTransfer({
        userId: Number(userId),
        fromAccountId: fromAccountId ? Number(fromAccountId) : null,
        toAccountId: toAccountId ? Number(toAccountId) : null,
        amount: Number(amount),
        description,
        transferType: String(type),
        status: 'COMPLETED',
        beneficiaryId: beneficiaryId ? Number(beneficiaryId) : null,
      });
      res.status(201).json(transfer);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create transfer", error: error.message });
    }
  });

  // Admin: Update transfer
  app.patch("/api/admin/transfers/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, description, status } = req.body;

      const [existingTransfer] = await db.select().from(transfersTable)
        .where(eq(transfersTable.id, Number(id)));

      if (!existingTransfer) {
        return res.status(404).json({ message: "Transfer not found" });
      }

      const updateData: any = {};
      if (amount !== undefined) updateData.amount = Number(amount);
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) {
        updateData.status = status;
        if (status === 'COMPLETED') {
          updateData.completedAt = new Date();
        }
      }

      await db.update(transfersTable)
        .set(updateData)
        .where(eq(transfersTable.id, Number(id)));

      const [updatedTransfer] = await db.select().from(transfersTable)
        .where(eq(transfersTable.id, Number(id)));

      res.json(updatedTransfer);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update transfer", error: error.message });
    }
  });

  // Admin: Delete transfer
  app.delete("/api/admin/transfers/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params;

      const [transfer] = await db.select().from(transfersTable)
        .where(eq(transfersTable.id, Number(id)));

      if (!transfer) {
        return res.status(404).json({ message: "Transfer not found" });
      }

      // If transfer was completed, reverse the account balance changes
      if (transfer.status === 'COMPLETED' && transfer.fromAccountId) {
        const [fromAccount] = await db.select().from(accountsTable)
          .where(eq(accountsTable.id, Number(transfer.fromAccountId)));

        if (fromAccount) {
          const currentBalance = parseFloat(String(fromAccount.balance || '0'));
          const newBalance = (currentBalance + Number(transfer.amount)).toFixed(2);
          await db.update(accountsTable)
            .set({ balance: newBalance })
            .where(eq(accountsTable.id, Number(transfer.fromAccountId)));
        }
      }

      await db.delete(transfersTable).where(eq(transfersTable.id, Number(id)));

      res.json({ message: "Transfer deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete transfer", error: error.message });
    }
  });

  // Bills admin
  app.get("/api/admin/bills", requireAdmin as any, async (req, res) => {
    try {
      const { limit = '25', offset = '0' } = req.query as any;
      const rows = await db.select().from(billsTable).limit(Number(limit)).offset(Number(offset));
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load bills", error: e.message });
    }
  });

  // Admin notifications for current admin
  app.get("/api/admin/notifications", requireAdmin as any, async (req, res) => {
    try {
      // @ts-ignore
      const adminId = req.session.user?.id;
      const rows = await db.select().from(notificationsTable).where(eq(notificationsTable.userId, Number(adminId))).orderBy(notificationsTable.createdAt);
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load notifications", error: e.message });
    }
  });

  // Admin unread notifications count
  app.get("/api/admin/notifications/unread-count", requireAdmin as any, async (req, res) => {
    try {
      // @ts-ignore
      const adminId = Number(req.session.user?.id);
      const rows = await db.select().from(notificationsTable)
        .where(and(eq(notificationsTable.userId, adminId), eq(notificationsTable.isRead as any, 'false' as any)));
      res.json({ count: rows.length });
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load unread count", error: e.message });
    }
  });

  // Admin: mark notification as read
  app.patch("/api/admin/notifications/:id/read", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      // @ts-ignore
      const adminId = Number(req.session.user?.id);
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

      // ensure notification belongs to current admin
      const [existing] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, Number(id))).orderBy(notificationsTable.createdAt);
      if (!existing) return res.status(404).json({ message: 'Notification not found' });
      if (Number(existing.userId) !== adminId) return res.status(403).json({ message: 'Forbidden' });

      await db
        .update(notificationsTable)
        .set({ isRead: 'true' as any })
        .where(eq(notificationsTable.id, Number(id)));

      const [row] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, Number(id))).orderBy(notificationsTable.createdAt);
      res.json(row);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to mark notification as read", error: e.message });
    }
  });

  // Transactions admin
  app.get("/api/admin/transactions", requireAdmin as any, async (req, res) => {
    try {
      const { limit = '25', offset = '0' } = req.query as any;
      const rows = await db.select().from(transactionsTable).orderBy(transactionsTable.createdAt).limit(Number(limit)).offset(Number(offset));
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load transactions", error: e.message });
    }
  });

  // Transaction by id (admin)
  app.get("/api/admin/transactions/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const rows = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(id)));
      if (!rows || rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
      res.json(rows[0]);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load transaction", error: e.message });
    }
  });

  // Admin: delete transaction and revert its effects
  app.delete("/api/admin/transactions/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const [tx] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(id)));
      if (!tx) return res.status(404).json({ message: 'Transaction not found' });

      const amount = parseFloat(String((tx as any).amount || '0'));

      if (tx.toAccountId != null) {
        const toId = Number(tx.toAccountId);
        const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, toId));
        if (acc) {
          const currentBalance = parseFloat(String((acc as any).balance || '0'));
          const currentTotalCredit = parseFloat(String((acc as any).totalCredit || '0'));
          const newBalance = (currentBalance - amount).toFixed(2);
          const newTotalCredit = Math.max(0, currentTotalCredit - amount).toFixed(2);
          await db.update(accountsTable).set({ balance: newBalance as any, totalCredit: newTotalCredit as any }).where(eq(accountsTable.id, toId));
        }
      }

      if (tx.fromAccountId != null) {
        const fromId = Number(tx.fromAccountId);
        const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, fromId));
        if (acc) {
          const currentBalance = parseFloat(String((acc as any).balance || '0'));
          const currentTotalDebit = parseFloat(String((acc as any).totalDebit || '0'));
          const newBalance = (currentBalance + amount).toFixed(2);
          const newTotalDebit = Math.max(0, currentTotalDebit - amount).toFixed(2);
          await db.update(accountsTable).set({ balance: newBalance as any, totalDebit: newTotalDebit as any }).where(eq(accountsTable.id, fromId));
        }
      }

      await db.delete(transactionsTable).where(eq(transactionsTable.id, Number(id)));
      res.json({ message: 'Transaction deleted and balances reverted' });
    } catch (e: any) {
      res.status(500).json({ message: 'Failed to delete transaction', error: e.message });
    }
  });

  // Admin: create manual transaction
  app.post("/api/admin/transactions", requireAdmin as any, async (req, res) => {
    try {
      const body = req.body as any;

      const genRef = (prefix: string) => `${prefix}${Date.now().toString(36).toUpperCase()}`;
      let createdTx: any = null;

      if (body.transactionType === 'wire_transfer') {
        createdTx = await TransferService.createWireTransfer({
          userId: Number(body.userId),
          fromAccountId: body.fromAccountId != null ? Number(body.fromAccountId) : null,
          beneficiaryName: body.beneficiaryName ?? null,
          beneficiaryAccount: body.beneficiaryAccount ?? null,
          beneficiaryBank: body.beneficiaryBank ?? null,
          routingNumber: body.routingNumber ?? null,
          swiftCode: body.swiftCode ?? null,
          address: body.address ?? null,
          country: body.country ?? null,
          amount: Number(body.amount),
          description: body.description,
          transferType: 'wire_transfer',
          status: body.status,
          fees: body.fees,
          scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
        });
        // Override date if provided
        if (body.createdAt) {
          await db.update(transactionsTable)
            .set({ createdAt: new Date(body.createdAt) as any } as any)
            .where(eq(transactionsTable.id, Number(createdTx.id)));
          const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(createdTx.id)));
          createdTx = row;
        }
      } else if (body.transactionType === 'internal_transfer') {
        createdTx = await TransferService.createInternalTransfer({
          userId: Number(body.userId),
          fromAccountId: body.fromAccountId != null ? Number(body.fromAccountId) : null,
          toAccountId: body.toAccountId != null ? Number(body.toAccountId) : null,
          amount: Number(body.amount),
          description: body.description,
          transferType: 'internal_transfer',
          status: body.status,
          fees: body.fees,
          scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
        });
        if (body.createdAt) {
          await db.update(transactionsTable)
            .set({ createdAt: new Date(body.createdAt) as any } as any)
            .where(eq(transactionsTable.id, Number(createdTx.id)));
          const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(createdTx.id)));
          createdTx = row;
        }
      } else if (body.transactionType === 'local_transfer') {
        createdTx = await TransferService.createLocalTransfer({
          userId: Number(body.userId),
          fromAccountId: body.fromAccountId != null ? Number(body.fromAccountId) : null,
          beneficiaryId: body.beneficiaryId ?? null,
          amount: Number(body.amount),
          description: body.description,
          transferType: 'local_transfer',
          status: body.status,
          fees: body.fees,
          scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
        });
        if (body.createdAt) {
          await db.update(transactionsTable)
            .set({ createdAt: new Date(body.createdAt) as any } as any)
            .where(eq(transactionsTable.id, Number(createdTx.id)));
          const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(createdTx.id)));
          createdTx = row;
        }
      } else if (body.transactionType === 'deposit') {
        createdTx = await DepositService.createCardDeposit({
          userId: Number(body.userId),
          toAccountId: Number(body.toAccountId),
          amount: Number(body.amount),
          cardNumber: body.cardNumber,
          cvv: body.cvv,
          expiryDate: body.expiryDate,
          pin: body.pin
        });
        if (body.createdAt) {
          await db.update(transactionsTable)
            .set({ createdAt: new Date(body.createdAt) as any } as any)
            .where(eq(transactionsTable.id, Number(createdTx.id)));
          const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(createdTx.id)));
          createdTx = row;
        }

      } else if (body.transactionType === 'incoming_transfer') {
        // Credit toAccount and log transaction (simulating external money coming in)
        if (body.toAccountId == null) throw new Error('toAccountId is required for incoming transfer');
        const toId = Number(body.toAccountId);
        const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, toId));
        if (!acc) throw new Error('Account not found');

        const metaData = body.metadata;
        metaData.beneficiary_name = acc.accountType;
        metaData.beneficiary_account = acc.accountNumber;
        metaData.beneficiary_bank = acc.accountType;
        metaData.swift_code = acc.swiftCode;
        metaData.destination_currency = 'USD';
        metaData.destination_amount = body.amount;
        metaData.fee = body.fees;
        metaData.intermediary_banks = [];


        metaData.sender_name = body.senderName || undefined;
        const current = parseFloat(String(acc.balance || '0'));
        const amount = Number(body.amount);
        const newBalance = (current + amount).toFixed(2);
        const totalCredit = (parseFloat(String(acc.totalCredit || '0')) + amount).toFixed(2);
        const inserted = await db.insert(transactionsTable).values({
          toAccountId: toId,
          transactionType: 'incoming_transfer',
          amount: String(amount.toFixed(2)) as any,
          description: body.description || 'Incoming Transfer',
          status: body.status || 'completed',
          metadata: metaData ?? null,
          balance: newBalance,
          category: 'Incoming Transfer',
          reference: body.reference || genRef('INC-'),
          createdAt: body.createdAt ? new Date(body.createdAt) as any : new Date() as any,
        } as any).$returningId();
        const insertedId = inserted[0].id as number;
        const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, insertedId));
        await db.update(accountsTable).set({ balance: newBalance, totalCredit }).where(eq(accountsTable.id, toId));
        createdTx = row;

      } else if (body.transactionType === 'withdrawal' || body.transactionType === 'fee') {
        // Debit fromAccount and log transaction
        if (body.fromAccountId == null) throw new Error('fromAccountId is required for debit types');
        const fromId = Number(body.fromAccountId);
        const [acc] = await db.select().from(accountsTable).where(eq(accountsTable.id, fromId));
        if (!acc) throw new Error('Account not found');
        const current = parseFloat(String(acc.balance || '0'));
        const amount = Number(body.amount);
        const newBalance = (current - amount).toFixed(2);
        const totalDebit = (parseFloat(String(acc.totalDebit || '0')) + amount).toFixed(2);
        const inserted = await db.insert(transactionsTable).values({
          fromAccountId: fromId,
          toAccountId: null,
          transactionType: body.transactionType,
          amount: String(amount.toFixed(2)) as any,
          description: body.description || (body.transactionType === 'fee' ? 'Fee' : 'Withdrawal'),
          status: body.status || 'completed',
          metadata: body.metadata ?? null,
          balance: newBalance,
          category: body.transactionType === 'fee' ? 'Fee' : 'Withdrawal',
          reference: body.reference || genRef(body.transactionType === 'fee' ? 'FEE-' : 'WDL-'),
          createdAt: new Date() as any,
        } as any).$returningId();
        const insertedId = inserted[0].id as number;
        const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, insertedId));
        await db.update(accountsTable).set({ balance: newBalance, totalDebit }).where(eq(accountsTable.id, fromId));
        createdTx = row;
      } else {
        // Fallback: create a generic transaction without balance mutation
        const inserted = await db.insert(transactionsTable).values({
          fromAccountId: body.fromAccountId ?? null,
          toAccountId: body.toAccountId ?? null,
          transactionType: body.transactionType,
          amount: String(Number(body.amount).toFixed(2)) as any,
          description: body.description ?? null,
          status: body.status || 'pending',
          metadata: body.metadata ?? null,
          balance: body.balance ?? '0.00',
          category: body.category ?? 'Manual',
          reference: body.reference || genRef('TXN-'),
          createdAt: body.createdAt ? new Date(body.createdAt) as any : new Date() as any,
        } as any).$returningId();
        const insertedId = inserted[0].id as number;
        const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, insertedId));
        createdTx = row;
      }

      res.status(201).json(createdTx);
    } catch (e: any) {
      res.status(400).json({ message: "Failed to create transaction", error: e.message });
    }
  });

  // Admin: update transaction
  app.patch("/api/admin/transactions/:id", requireAdmin as any, async (req, res) => {
    try {
      const { id } = req.params as any;
      const body = req.body as any;

      const update: any = {};
      if (body.fromAccountId !== undefined) update.fromAccountId = body.fromAccountId;
      if (body.toAccountId !== undefined) update.toAccountId = body.toAccountId;
      if (body.transactionType !== undefined) update.transactionType = body.transactionType;
      if (body.amount !== undefined) update.amount = String(Number(body.amount).toFixed(2));
      if (body.description !== undefined) update.description = body.description;
      if (body.status !== undefined) update.status = body.status;
      if (body.metadata !== undefined) update.metadata = body.metadata;
      if (body.reference !== undefined) update.reference = body.reference;
      if (body.createdAt !== undefined) update.createdAt = body.createdAt ? new Date(body.createdAt) : null;

      await db.update(transactionsTable).set(update).where(eq(transactionsTable.id, Number(id)));
      const [row] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, Number(id)));
      res.json(row);
    } catch (e: any) {
      res.status(400).json({ message: "Failed to update transaction", error: e.message });
    }
  });

  // Admin statements with filtering
  app.get("/api/admin/statements", requireAdmin as any, async (req, res) => {
    try {
      const {
        limit = '50',
        offset = '0',
        type,
        status,
        accountId,
        userId,
        startDate,
        endDate,
        search
      } = req.query as any;

      // Apply filters
      const conditions = [];

      if (type) {
        conditions.push(eq(transactionsTable.transactionType, type));
      }

      if (status) {
        conditions.push(eq(transactionsTable.status, status));
      }

      if (accountId) {
        conditions.push(eq(transactionsTable.fromAccountId, Number(accountId)));
      }

      if (userId) {
        conditions.push(eq(accountsTable.userId, Number(userId)));
      }

      if (startDate) {
        conditions.push(eq(transactionsTable.createdAt, new Date(startDate)));
      }

      if (endDate) {
        conditions.push(eq(transactionsTable.createdAt, new Date(endDate)));
      }

      // Execute the main query
      let rows;
      if (conditions.length > 0) {
        rows = await db
          .select({
            id: transactionsTable.id,
            transactionType: transactionsTable.transactionType,
            amount: transactionsTable.amount,
            description: transactionsTable.description,
            status: transactionsTable.status,
            balance: transactionsTable.balance,
            category: transactionsTable.category,
            reference: transactionsTable.reference,
            createdAt: transactionsTable.createdAt,
            completedAt: transactionsTable.completedAt,
            fromAccountId: transactionsTable.fromAccountId,
            toAccountId: transactionsTable.toAccountId,
            // Join account details
            fromAccountNumber: accountsTable.accountNumber,
            fromAccountType: accountsTable.accountType,
            // Join user details
            userId: accountsTable.userId,
            userFirstName: usersTable.firstName,
            userLastName: usersTable.lastName,
            userEmail: usersTable.email
          })
          .from(transactionsTable)
          .leftJoin(accountsTable, eq(transactionsTable.fromAccountId, accountsTable.id))
          .leftJoin(usersTable, eq(accountsTable.userId, usersTable.id))
          .where(and(...conditions))
          .orderBy(desc(transactionsTable.createdAt))
          .limit(Number(limit))
          .offset(Number(offset));
      } else {
        rows = await db
          .select({
            id: transactionsTable.id,
            transactionType: transactionsTable.transactionType,
            amount: transactionsTable.amount,
            description: transactionsTable.description,
            status: transactionsTable.status,
            balance: transactionsTable.balance,
            category: transactionsTable.category,
            reference: transactionsTable.reference,
            createdAt: transactionsTable.createdAt,
            completedAt: transactionsTable.completedAt,
            fromAccountId: transactionsTable.fromAccountId,
            toAccountId: transactionsTable.toAccountId,
            // Join account details
            fromAccountNumber: accountsTable.accountNumber,
            fromAccountType: accountsTable.accountType,
            // Join user details
            userId: accountsTable.userId,
            userFirstName: usersTable.firstName,
            userLastName: usersTable.lastName,
            userEmail: usersTable.email
          })
          .from(transactionsTable)
          .leftJoin(accountsTable, eq(transactionsTable.fromAccountId, accountsTable.id))
          .leftJoin(usersTable, eq(accountsTable.userId, usersTable.id))
          .orderBy(desc(transactionsTable.createdAt))
          .limit(Number(limit))
          .offset(Number(offset));
      }

      // Get total count for pagination
      let countResult;
      if (conditions.length > 0) {
        countResult = await db
          .select({ count: sql`count(*)` })
          .from(transactionsTable)
          .leftJoin(accountsTable, eq(transactionsTable.fromAccountId, accountsTable.id))
          .leftJoin(usersTable, eq(accountsTable.userId, usersTable.id))
          .where(and(...conditions));
      } else {
        countResult = await db
          .select({ count: sql`count(*)` })
          .from(transactionsTable)
          .leftJoin(accountsTable, eq(transactionsTable.fromAccountId, accountsTable.id))
          .leftJoin(usersTable, eq(accountsTable.userId, usersTable.id));
      }

      const [{ count }] = countResult;

      res.json({
        transactions: rows,
        total: Number(count),
        limit: Number(limit),
        offset: Number(offset)
      });
    } catch (e: any) {
      res.status(500).json({ message: "Failed to load statements", error: e.message });
    }
  });

  app.patch("/api/transfers/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: string; completedAt?: string | Date | null };
      const completedAtDate = status === 'COMPLETED' ? new Date() : undefined;
      const transfer = await storage.updateTransferStatus(Number(id), status, completedAtDate);
      res.json(transfer);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update transfer status", error: error.message });
    }
  });

  // Bill routes
  app.get("/api/bills/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const bills = await storage.getUserBills(Number(userId));
      res.json(bills);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch bills", error: error.message });
    }
  });

  app.post("/api/bills", async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(validatedData);
      res.status(201).json(bill);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid bill data", error: error.message });
    }
  });

  app.patch("/api/bills/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const bill = await storage.updateBillStatus(Number(id), status);
      res.json(bill);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update bill status", error: error.message });
    }
  });

  app.delete("/api/bills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBill(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete bill", error: error.message });
    }
  });

  // Loan routes
  app.get("/api/loans/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const loans = await storage.getUserLoans(Number(userId));
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch loans", error: error.message });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const validatedData = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(validatedData);
      res.status(201).json(loan);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid loan data", error: error.message });
    }
  });

  // Investment routes
  app.get("/api/investments/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const investments = await storage.getUserInvestments(Number(userId));
      res.json(investments);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch investments", error: error.message });
    }
  });

  app.post("/api/investments", async (req, res) => {
    try {
      const validatedData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(validatedData);
      res.status(201).json(investment);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid investment data", error: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications = await storage.getUserNotifications(Number(userId));
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid notification data", error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(Number(id));
      res.json(notification);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNotification(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete notification", error: error.message });
    }
  });

  // Countries and States endpoints
  app.get("/api/countries", async (_req, res) => {
    try {
      const all = await db.select().from(countries);
      res.json(all);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch countries", error: error.message });
    }
  });

  app.get("/api/countries/:countryId/states", async (req, res) => {
    try {
      const { countryId } = req.params;
      const rows = await db.select().from(states).where(eq(states.countryId, Number(countryId)));
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch states", error: error.message });
    }
  });

  app.get("/api/countries/:countryId/cities", async (req, res) => {
    try {
      const { countryId } = req.params;
      const cid = Number(countryId);
      let rows = await db.select().from(states).where(eq(states.countryId, cid));
      if (rows.length === 0) {
        // Lazy-populate cities for this country
        const [countryRow] = await db.select().from(countries).where(eq(countries.id, cid));
        if (!countryRow) {
          return res.status(404).json({ message: "Country not found" });
        }
        try {
          const cityRes = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: countryRow.name }),
          });
          const cityJson: any = await cityRes.json();
          const cityList: string[] = cityJson?.data ?? [];
          for (const cityName of cityList) {
            if (!cityName) continue;
            await db.insert(states).values({ countryId: cid, name: cityName });
          }
          rows = await db.select().from(states).where(eq(states.countryId, cid));
        } catch (e: any) {
          // Fall through with empty rows if remote fails
          console.error("Failed to fetch cities lazily:", e?.message || e);
        }
      }
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch cities", error: error.message });
    }
  });

  // Open Account Application endpoint
  const uploadDir = path.resolve(process.cwd(), "server", "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });
  const storageMulter = multer({ dest: uploadDir });

  app.post("/api/applications", storageMulter.fields([
    { name: "passport", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
  ]), async (req, res) => {
    try {
      const body = req.body as any;
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const passportFile = files?.passport?.[0];
      const idFile = files?.idDocument?.[0];
      const passwordHash = bcrypt.hashSync(body.password, 12);
      const pinHash = bcrypt.hashSync(body.pin, 12);
      const validated = insertApplicationSchema.parse({
        name: body.name,
        email: body.email,
        phone: body.phone,
        dob: body.dob ? String(body.dob) : undefined,
        gender: body.gender,
        ssn: body.ssn,
        occupation: body.occupation,
        countryId: body.countryId ? Number(body.countryId) : undefined,
        cityId: body.cityId ? Number(body.cityId) : undefined,
        zip: body.zip,
        address: body.address,
        nokName: body.nokName,
        nokEmail: body.nokEmail,
        nokPhone: body.nokPhone,
        nokRelationship: body.nokRelationship,
        nokAddress: body.nokAddress,
        currency: body.currency,
        passportPath: passportFile ? path.relative(path.resolve(process.cwd(), "server"), passportFile.path) : undefined,
        idPath: idFile ? path.relative(path.resolve(process.cwd(), "server"), idFile.path) : undefined,
        passwordHash,
        pinHash,
      });

      // Save application
      const insertRes = await db.insert(applications).values(validated).$returningId();

      // Create user and default accounts as part of registration
      const userPassword = passwordHash;
      await db.insert(usersTable).values({
        username: await generateUnique8DigitUsername(),
        password: userPassword,
        firstName: validated.name.split(" ")[0] || validated.name,
        lastName: validated.name.split(" ")[1] || "",
        email: validated.email,
        phone: validated.phone,
      });
      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, validated.email));
      if (user) {
        const defaultAccounts = ["savings", "checking", "current"] as const;
        for (const type of defaultAccounts) {
          await db.insert(accountsTable).values({
            userId: user.id,
            accountType: type as any,
            accountNumber: generateAccountNumber(),
            balance: '0.00',
            totalCredit: '0.00',
            totalDebit: '0.00',
          });
        }
        // Autologin new user via session
        // @ts-ignore
        req.session.userId = user.id;
        // @ts-ignore
        req.session.user = {
          id: user.id,
          username: user.username,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          email: user.email,
        };
      }

      res.status(201).json({ ok: true });
    } catch (error: any) {
      res.status(400).json({ message: "Failed to submit application", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
