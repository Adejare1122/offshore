import { relations } from "drizzle-orm";
import { mysqlTable, text, varchar, mysqlEnum, decimal, json, timestamp, int } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int().primaryKey().autoincrement(),
  username: varchar("username", { length: 191 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 191 }).notNull(),
  lastName: varchar("last_name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  dob: varchar("dob", { length: 50 }),
  pinHash: varchar("pin_hash", { length: 255 }),
  kyc_status: mysqlEnum("kyc_status", ["pending", "verified", "rejected"]).notNull().default('pending'),
  role: varchar("role", { length: 20 }).notNull().default('USER'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = mysqlTable("accounts", {
  id: int().primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountType: mysqlEnum("account_type", ['savings', 'checking', 'current', 'investment']).notNull(),
  accountNumber: varchar("account_number", { length: 191 }).notNull().unique(),
  routingNumber: varchar("routing_number", { length: 50 }),
  swiftCode: varchar("swift_code", { length: 50 }),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default('0.00'),
  totalCredit: decimal("total_credit", { precision: 15, scale: 2 }).notNull().default('0.00'),
  totalDebit: decimal("total_debit", { precision: 15, scale: 2 }).notNull().default('0.00'),
  status: mysqlEnum("status", ['active', 'inactive', 'frozen', 'closed']).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const beneficiaries = mysqlTable("beneficiaries", {
  id: int().primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 191 }).notNull(),
  accountNumber: varchar("account_number", { length: 191 }).notNull(),
  bankName: varchar("bank_name", { length: 191 }).notNull(),
  routingNumber: varchar("routing_number", { length: 50 }),
  beneficiaryType: varchar("beneficiary_type", { length: 50 }).notNull(),
  swiftCode: varchar("swift_code", { length: 50 }),
  address: text("address"),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int().primaryKey().autoincrement(),
  toAccountId: int("to_account_id").references(() => accounts.id, { onDelete: "cascade" }),
  fromAccountId: int("from_account_id").references(() => accounts.id, { onDelete: "cascade" }),
  transactionType: mysqlEnum("transaction_type", ['internal_transfer', 'local_transfer', 'wire_transfer', 'bill_payment', 'airtime_topup', 'data_topup', 'crypto_buy', 'crypto_sell', 'crypto_transfer', 'deposit', 'fee', 'incoming_transfer']).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ['pending', 'processing', 'completed', 'failed', 'cancelled']).notNull().default('pending'),
  metadata: json("metadata"),
  balance: varchar("balance", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }),
  reference: varchar("reference", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const creditCards = mysqlTable("credit_cards", {
  id: int().primaryKey().autoincrement(),
  accountId: int("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  cardNumber: varchar("card_number", { length: 32 }).notNull(),
  cardholderName: varchar("cardholder_name", { length: 191 }).notNull(),
  expiryMonth: int("expiry_month").notNull(),
  expiryYear: int("expiry_year").notNull(),
  cardType: varchar("card_type", { length: 20 }).notNull().default('DEBIT'),
  creditLimit: decimal("credit_limit", { precision: 15, scale: 2 }).default('0.00'),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).default('0.00'),
  isActive: varchar("is_active", { length: 5 }).notNull().default('true'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transfers = mysqlTable("transfers", {
  id: int().primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fromAccountId: int("from_account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  toAccountId: int("to_account_id").references(() => accounts.id, { onDelete: "cascade" }),
  beneficiaryId: int("beneficiary_id").references(() => beneficiaries.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  transferType: varchar("transfer_type", { length: 50 }).notNull(),
  description: text("description"),
  reference: varchar("reference", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default('PENDING'),
  fees: decimal("fees", { precision: 15, scale: 2 }).default('0.00'),
  scheduledDate: timestamp("scheduled_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bills = mysqlTable("bills", {
  id: int().primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  billerName: varchar("biller_name", { length: 191 }).notNull(),
  accountNumber: varchar("account_number", { length: 191 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('PENDING'),
  isRecurring: varchar("is_recurring", { length: 5 }).notNull().default('false'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loans = mysqlTable("loans", {
  id: int().primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  loanType: varchar("loan_type", { length: 50 }).notNull(),
  principal: decimal("principal", { precision: 15, scale: 2 }).notNull(),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  termMonths: int("term_months").notNull(),
  monthlyPayment: decimal("monthly_payment", { precision: 15, scale: 2 }).notNull(),
  nextPaymentDate: timestamp("next_payment_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('ACTIVE'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const investments = mysqlTable("investments", {
  id: int().primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  investmentType: varchar("investment_type", { length: 50 }).notNull(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  shares: decimal("shares", { precision: 15, scale: 6 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 15, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 15, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  gainLoss: decimal("gain_loss", { precision: 15, scale: 2 }).notNull().default('0.00'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Geo tables
export const countries = mysqlTable("countries", {
  id: int().primaryKey().autoincrement(),
  name: varchar("name", { length: 191 }).notNull().unique(),
  iso2: varchar("iso2", { length: 2 }).notNull().unique(),
  iso3: varchar("iso3", { length: 3 }),
});

export const states = mysqlTable("states", {
  id: int().primaryKey().autoincrement(),
  countryId: int("country_id").notNull().references(() => countries.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 191 }).notNull(),
  code: varchar("code", { length: 10 }),
});


export const notifications = mysqlTable("notifications", {
  id: int().primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 191 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isRead: varchar("is_read", { length: 5 }).notNull().default('false'),
  priority: varchar("priority", { length: 10 }).notNull().default('NORMAL'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Open Account Applications
export const applications = mysqlTable("applications", {
  id: int().primaryKey().autoincrement(),
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  dob: varchar("dob", { length: 50 }),
  gender: varchar("gender", { length: 10 }),
  ssn: varchar("ssn", { length: 100 }),
  occupation: varchar("occupation", { length: 191 }),
  countryId: int("country_id"),
  cityId: int("city_id"),
  zip: varchar("zip", { length: 20 }),
  address: text("address"),
  nokName: varchar("nok_name", { length: 191 }),
  nokEmail: varchar("nok_email", { length: 191 }),
  nokPhone: varchar("nok_phone", { length: 100 }),
  nokRelationship: varchar("nok_relationship", { length: 100 }),
  nokAddress: text("nok_address"),
  currency: varchar("currency", { length: 20 }),
  passportPath: text("passport_path"),
  idPath: text("id_path"),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  pinHash: varchar("pin_hash", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('PENDING'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  beneficiaries: many(beneficiaries),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
  transactions: many(transactions),
  creditCards: many(creditCards),
}));

export const beneficiariesRelations = relations(beneficiaries, ({ one }) => ({
  user: one(users, { fields: [beneficiaries.userId], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  toAccount: one(accounts, { fields: [transactions.toAccountId], references: [accounts.id] }),
  fromAccount: one(accounts, { fields: [transactions.fromAccountId], references: [accounts.id] }),
}));

export const creditCardsRelations = relations(creditCards, ({ one }) => ({
  account: one(accounts, { fields: [creditCards.accountId], references: [accounts.id] }),
}));

export const transfersRelations = relations(transfers, ({ one }) => ({
  user: one(users, { fields: [transfers.userId], references: [users.id] }),
  fromAccount: one(accounts, { fields: [transfers.fromAccountId], references: [accounts.id] }),
  toAccount: one(accounts, { fields: [transfers.toAccountId], references: [accounts.id] }),
  beneficiary: one(beneficiaries, { fields: [transfers.beneficiaryId], references: [beneficiaries.id] }),
}));

export const billsRelations = relations(bills, ({ one }) => ({
  user: one(users, { fields: [bills.userId], references: [users.id] }),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  user: one(users, { fields: [loans.userId], references: [users.id] }),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, { fields: [investments.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  states: many(states),
}));

export const statesRelations = relations(states, ({ one }) => ({
  country: one(countries, { fields: [states.countryId], references: [countries.id] }),
}));


// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
});

export const insertBeneficiarySchema = createInsertSchema(beneficiaries).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertCreditCardSchema = createInsertSchema(creditCards).omit({
  id: true,
  createdAt: true,
});

export const insertTransferSchema = createInsertSchema(transfers).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export const insertStateSchema = createInsertSchema(states).omit({
  id: true,
});


// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Beneficiary = typeof beneficiaries.$inferSelect;
export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
// Narrowed runtime type for metadata to include enriched join context
export type Transaction = (typeof transactions.$inferSelect) & {
  metadata?: {
    fromAccount?: {
      id?: number | null;
      number?: string | null;
      type?: string | null;
      user?: { id?: number | null; firstName?: string | null; lastName?: string | null };
    };
    toAccount?: {
      id?: number | null;
      number?: string | null;
      type?: string | null;
      user?: { id?: number | null; firstName?: string | null; lastName?: string | null };
    };
    [key: string]: any;
  } | null;
};
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type CreditCard = typeof creditCards.$inferSelect;
export type InsertCreditCard = z.infer<typeof insertCreditCardSchema>;
export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type State = typeof states.$inferSelect;
export type InsertState = z.infer<typeof insertStateSchema>;
