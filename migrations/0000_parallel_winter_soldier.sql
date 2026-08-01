CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`account_type` enum('savings','checking','current','investment') NOT NULL,
	`account_number` varchar(191) NOT NULL,
	`routing_number` varchar(50),
	`swift_code` varchar(50),
	`balance` decimal(15,2) NOT NULL DEFAULT '0.00',
	`total_credit` decimal(15,2) NOT NULL DEFAULT '0.00',
	`total_debit` decimal(15,2) NOT NULL DEFAULT '0.00',
	`status` enum('active','inactive','frozen','closed') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_account_number_unique` UNIQUE(`account_number`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`phone` varchar(50),
	`dob` varchar(50),
	`gender` varchar(10),
	`ssn` varchar(100),
	`occupation` varchar(191),
	`country_id` int,
	`city_id` int,
	`zip` varchar(20),
	`address` text,
	`nok_name` varchar(191),
	`nok_email` varchar(191),
	`nok_phone` varchar(100),
	`nok_relationship` varchar(100),
	`nok_address` text,
	`currency` varchar(20),
	`passport_path` text,
	`id_path` text,
	`password_hash` varchar(255) NOT NULL,
	`pin_hash` varchar(255) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `beneficiaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(191) NOT NULL,
	`account_number` varchar(191) NOT NULL,
	`bank_name` varchar(191) NOT NULL,
	`routing_number` varchar(50),
	`beneficiary_type` varchar(50) NOT NULL,
	`swift_code` varchar(50),
	`address` text,
	`country` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `beneficiaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`biller_name` varchar(191) NOT NULL,
	`account_number` varchar(191) NOT NULL,
	`category` varchar(100) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`due_date` timestamp NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`is_recurring` varchar(5) NOT NULL DEFAULT 'false',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`iso2` varchar(2) NOT NULL,
	`iso3` varchar(3),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `countries_name_unique` UNIQUE(`name`),
	CONSTRAINT `countries_iso2_unique` UNIQUE(`iso2`)
);
--> statement-breakpoint
CREATE TABLE `credit_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`account_id` int NOT NULL,
	`card_number` varchar(32) NOT NULL,
	`cardholder_name` varchar(191) NOT NULL,
	`expiry_month` int NOT NULL,
	`expiry_year` int NOT NULL,
	`card_type` varchar(20) NOT NULL DEFAULT 'DEBIT',
	`credit_limit` decimal(15,2) DEFAULT '0.00',
	`current_balance` decimal(15,2) DEFAULT '0.00',
	`is_active` varchar(5) NOT NULL DEFAULT 'true',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credit_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`investment_type` varchar(50) NOT NULL,
	`symbol` varchar(50) NOT NULL,
	`name` varchar(191) NOT NULL,
	`shares` decimal(15,6) NOT NULL,
	`purchase_price` decimal(15,2) NOT NULL,
	`current_price` decimal(15,2) NOT NULL,
	`total_value` decimal(15,2) NOT NULL,
	`gain_loss` decimal(15,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`loan_type` varchar(50) NOT NULL,
	`principal` decimal(15,2) NOT NULL,
	`current_balance` decimal(15,2) NOT NULL,
	`interest_rate` decimal(5,2) NOT NULL,
	`term_months` int NOT NULL,
	`monthly_payment` decimal(15,2) NOT NULL,
	`next_payment_date` timestamp NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(191) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`is_read` varchar(5) NOT NULL DEFAULT 'false',
	`priority` varchar(10) NOT NULL DEFAULT 'NORMAL',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country_id` int NOT NULL,
	`name` varchar(191) NOT NULL,
	`code` varchar(10),
	CONSTRAINT `states_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`to_account_id` int,
	`from_account_id` int,
	`transaction_type` enum('internal_transfer','local_transfer','wire_transfer','bill_payment','airtime_topup','data_topup','crypto_buy','crypto_sell','crypto_transfer','deposit','fee','incoming_transfer') NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`description` text NOT NULL,
	`status` enum('pending','processing','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`metadata` json,
	`balance` varchar(50) NOT NULL,
	`category` varchar(100),
	`reference` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`from_account_id` int NOT NULL,
	`to_account_id` int,
	`beneficiary_id` int,
	`amount` decimal(15,2) NOT NULL,
	`transfer_type` varchar(50) NOT NULL,
	`description` text,
	`reference` varchar(100),
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`fees` decimal(15,2) DEFAULT '0.00',
	`scheduled_date` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transfers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(191) NOT NULL,
	`password` varchar(255) NOT NULL,
	`first_name` varchar(191) NOT NULL,
	`last_name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`phone` varchar(50),
	`dob` varchar(50),
	`pin_hash` varchar(255),
	`kyc_status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`role` varchar(20) NOT NULL DEFAULT 'USER',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `beneficiaries` ADD CONSTRAINT `beneficiaries_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bills` ADD CONSTRAINT `bills_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `credit_cards` ADD CONSTRAINT `credit_cards_account_id_accounts_id_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `investments` ADD CONSTRAINT `investments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loans` ADD CONSTRAINT `loans_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `states` ADD CONSTRAINT `states_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_to_account_id_accounts_id_fk` FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_from_account_id_accounts_id_fk` FOREIGN KEY (`from_account_id`) REFERENCES `accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `transfers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `transfers_from_account_id_accounts_id_fk` FOREIGN KEY (`from_account_id`) REFERENCES `accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `transfers_to_account_id_accounts_id_fk` FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transfers` ADD CONSTRAINT `transfers_beneficiary_id_beneficiaries_id_fk` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiaries`(`id`) ON DELETE cascade ON UPDATE no action;