import { db } from "./db";
import { users, accounts, creditCards, countries, states, transactions } from "../shared/schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { passwordUtils } from "./auth";

function generateAccountNumber(prefix: string): string {
    const suffix = Math.floor(1_000_000_000 + Math.random() * 8_999_999_999).toString();
    // return `${prefix}${suffix}`.slice(0, 16);
    return `${suffix}`.slice(0, 10);

}

function generateCardNumber(prefix: string): string {
    const body = Math.floor(1_0000_0000_0000 + Math.random() * 8_9999_9999_9999).toString();
    return `${prefix}${body}`.slice(0, 16);
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

export async function seedInitialData() {

    const sampleUsers = [
        {
            password: passwordUtils.hashPassword("password123"),
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "555-0100",
            role: 'USER' as const,
        },
        {
            password: passwordUtils.hashPassword("admin123"),
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            phone: "555-0199",
            role: 'ADMIN' as const,
        },
    ];

    for (const u of sampleUsers) {
        // Upsert user
        const [found] = await db.select().from(users).where(eq(users.email, u.email));
        let userId = found?.id as number | undefined;
        if (!found) {
            await db.insert(users).values({
                username: await generateUnique8DigitUsername(),
                password: u.password,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                phone: u.phone,
                // @ts-ignore
                role: (u as any).role || 'USER',
            });
            const [created] = await db.select().from(users).where(eq(users.email, u.email));
            userId = created?.id as number | undefined;
        }
        if (!userId) continue;

        // Create three accounts and a card per account
        const accountTypes = ["savings", "checking", "current"] as const;
        for (const type of accountTypes) {
            const accountNumber = generateAccountNumber(type[0]);
            await db
                .insert(accounts)
                .values({
                    userId,
                    accountType: type,
                    accountNumber,
                    balance: '10000.00',
                    totalCredit: '0.00',
                    totalDebit: '0.00',
                });
            const [accountRow] = await db.select().from(accounts).where(eq(accounts.accountNumber, accountNumber));
            const accountId = accountRow?.id as number | undefined;
            if (!accountId) continue;

            if (type === "savings") {
                await db.insert(creditCards).values({
                    accountId,
                    cardNumber: generateCardNumber("4"),
                    cardholderName: `${u.firstName} ${u.lastName}`,
                    expiryMonth: 12,
                    expiryYear: new Date().getFullYear() + 3,
                    cardType: "DEBIT",
                    creditLimit: '5000.00',
                    currentBalance: '0.00',
                    isActive: 'true',
                });
            }

            // Seed ~5 realistic transactions only for savings/checking
            if ((u as any).role === 'USER') {
                if (type === "savings" || type === "checking") {
                    // Skip if already seeded
                    const existingTx = await db.select().from(transactions).where(eq(transactions.toAccountId, accountId));
                    const existingTx2 = await db.select().from(transactions).where(eq(transactions.fromAccountId, accountId));
                    if ((existingTx.length + existingTx2.length) >= 20) {
                        continue;
                    }

                    // Helper for running balances
                    let runningBalance = parseFloat(String(accountRow.balance || '0'));
                    let totalCredit = parseFloat(String(accountRow.totalCredit || '0'));
                    let totalDebit = parseFloat(String(accountRow.totalDebit || '0'));

                    // Location data
                    const italyCities = ["Rome", "Milan", "Naples", "Florence", "Turin", "Bologna", "Genoa", "Venice", "Palermo", "Bari", "Catania", "Verona", "Brescia", "Como", "Pisa", "Prato", "Salerno", "Trento", "Treviso", "Trieste", "Udine", "Varese", "Venezia", "Vicenza", "Viterbo"];
                    const usaCities = ["New York", "San Francisco", "Chicago", "Los Angeles", "Seattle", "Austin", "Miami", "Boston", "Washington", "Atlanta", "Dallas", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "San Jose", "Jacksonville", "Columbus", "Charlotte", "Indianapolis", "San Francisco", "Seattle", "Austin", "Miami", "Boston", "Washington", "Atlanta", "Dallas", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "San Jose", "Jacksonville", "Columbus", "Charlotte", "Indianapolis"];
                    const italyBanks = [
                        "UniCredit",
                        "Intesa Sanpaolo",
                        "Banca Monte dei Paschi di Siena",
                        "Banco BPM",
                        "BPER Banca",
                        "Mediobanca",
                        "Banca Popolare di Milano"
                    ];
                    const usaBanks = [
                        "JPMorgan Chase",
                        "Bank of America",
                        "Wells Fargo",
                        "Citibank",
                        "U.S. Bank",
                        "PNC Bank",
                        "Capital One",
                        "TD Bank",
                        "Barclays",
                        "HSBC",
                        "NatWest",
                        "Santander",
                        "RBS",
                        "Lloyds Bank",
                        "Barclaycard",
                        "Metro Bank",
                        "Virgin Money",
                        "Halifax",
                        "Sainsbury's Bank",
                        "Co-operative Bank",
                        "Clydesdale Bank",
                        "Coutts",
                        "First Direct",
                        "Halifax",
                        "Sainsbury's Bank",
                        "Co-operative Bank"
                    ];

                    const italyFirstNames = ["Luca", "Marco", "Giulia", "Francesca", "Matteo", "Alessia", "Giuseppe", "Elena", "Simone", "Chiara", "Mattia", "Sara", "Lorenzo", "Anna", "Andrea", "Laura", "Davide", "Martina", "Francesco", "Cristina"];
                    const italyLastNames = ["Rossi", "Ferrari", "Russo", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Galli", "Gallo", "Rizzi", "Carli", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno"];
                    const usaFirstNames = ["John", "Emily", "Michael", "Sarah", "David", "Ashley", "Daniel", "Jessica", "James", "Amanda", "David", "Ashley", "Daniel", "Jessica", "James", "Amanda"];
                    const usaLastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

                    const randomChoice = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
                    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
                    const randomPerson = (country: 'Italy' | 'USA') => {
                        if (country === 'Italy') {
                            return `${randomChoice(italyFirstNames)} ${randomChoice(italyLastNames)}`;
                        }
                        return `${randomChoice(usaFirstNames)} ${randomChoice(usaLastNames)}`;
                    };

                    const dateInRange = (start: Date, end: Date) => {
                        const s = start.getTime();
                        const e = end.getTime();
                        const t = s + Math.floor(Math.random() * (e - s));
                        return new Date(t);
                    };

                    const itStart = new Date('2016-01-01T00:00:00Z');
                    const itEnd = new Date('2019-12-31T23:59:59Z');
                    const usStart = new Date('2020-01-01T00:00:00Z');
                    const usEnd = new Date();

                    type TxTemplate = {
                        kind: 'credit' | 'debit';
                        type: 'incoming_transfer' | 'deposit' | 'local_transfer' | 'wire_transfer' | 'fee';
                        make: (ctx: { country: 'Italy' | 'USA'; city: string }) => { description: string; metadata: any; amount: number; category: string; referencePrefix: string };
                    };

                    const templates: TxTemplate[] = [
                        {
                            kind: 'credit',
                            type: 'incoming_transfer',
                            make: ({ country, city }) => ({
                                description: country === 'Italy'
                                    ? `SEPA CREDIT - PAYROLL ${city.toUpperCase()} IT - Alfa S.p.A.`
                                    : `ACH CREDIT - ACME CORP PAYROLL - ${city.toUpperCase()} US`,
                                metadata: {
                                    sender_name: country === 'Italy' ? 'Alfa S.p.A. Payroll' : 'Acme Corp Payroll',
                                    sender_account: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                                    sender_bank: country === 'Italy' ? randomChoice(italyBanks) : randomChoice(usaBanks),
                                    sender_reference: `PAY-${Math.floor(Math.random() * 900000 + 100000)}`,
                                    country,
                                    city,
                                },
                                amount: Math.round(rand(1500, 3500) * 100) / 100,
                                category: 'Income',
                                referencePrefix: 'INC-'
                            })
                        },
                        {
                            kind: 'debit',
                            type: 'local_transfer',
                            make: ({ country, city }) => {
                                const merchant = country === 'Italy' ? 'Coop' : 'Whole Foods';
                                return {
                                    description: country === 'Italy'
                                        ? `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} IT`
                                        : `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} US`,
                                    metadata: {
                                        merchant,
                                        beneficiary_name: randomPerson(country),
                                        beneficiary_account: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                                        beneficiary_bank: country === 'Italy' ? randomChoice(italyBanks) : randomChoice(usaBanks),
                                        routing_number: country === 'Italy' ? undefined : '026009593',
                                        bank_address: `${city}`,
                                        country, city
                                    },
                                    amount: Math.round(rand(30, 160) * 100) / 100,
                                    category: 'Groceries',
                                    referencePrefix: 'LOC-'
                                };
                            }
                        },
                        {
                            kind: 'debit',
                            type: 'local_transfer',
                            make: ({ country, city }) => {
                                const merchant = country === 'Italy' ? 'Eataly' : 'Chipotle';
                                return {
                                    description: country === 'Italy'
                                        ? `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} IT`
                                        : `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} US`,
                                    metadata: {
                                        merchant,
                                        beneficiary_name: randomPerson(country),
                                        beneficiary_account: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                                        beneficiary_bank: country === 'Italy' ? randomChoice(italyBanks) : randomChoice(usaBanks),
                                        routing_number: country === 'Italy' ? undefined : '026009593',
                                        bank_address: `${city}`,
                                        country, city
                                    },
                                    amount: Math.round(rand(20, 120) * 100) / 100,
                                    category: 'Dining',
                                    referencePrefix: 'LOC-'
                                };
                            }
                        },
                        {
                            kind: 'debit',
                            type: 'local_transfer',
                            make: ({ country, city }) => {
                                const merchant = country === 'Italy' ? 'NH Hotels' : 'Hilton';
                                return {
                                    description: country === 'Italy'
                                        ? `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} IT`
                                        : `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} US`,
                                    metadata: {
                                        merchant,
                                        beneficiary_name: randomPerson(country),
                                        beneficiary_account: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                                        beneficiary_bank: country === 'Italy' ? randomChoice(italyBanks) : randomChoice(usaBanks),
                                        routing_number: country === 'Italy' ? undefined : '026009593',
                                        bank_address: `${city}`,
                                        country, city
                                    },
                                    amount: Math.round(rand(90, 450) * 100) / 100,
                                    category: 'Hotel',
                                    referencePrefix: 'LOC-'
                                };
                            }
                        },
                        {
                            kind: 'debit',
                            type: 'local_transfer',
                            make: ({ country, city }) => ({
                                description: country === 'Italy'
                                    ? `SEPA TRANSFER - ENEL ENERGIA SPA - ${city.toUpperCase()} IT`
                                    : `ACH PAYMENT - CITY UTILITIES - ${city.toUpperCase()} US`,
                                metadata: {
                                    beneficiary_name: randomPerson(country),
                                    beneficiary_account: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                                    beneficiary_bank: country === 'Italy' ? randomChoice(italyBanks) : randomChoice(usaBanks),
                                    routing_number: country === 'Italy' ? undefined : '026009593',
                                    bank_address: `${city}`,
                                    country,
                                    city,
                                },
                                amount: Math.round(rand(60, 250) * 100) / 100,
                                category: 'Utilities',
                                referencePrefix: 'LOC-'
                            })
                        },
                        {
                            kind: 'debit',
                            type: 'wire_transfer',
                            make: ({ country, city }) => ({
                                description: country === 'Italy'
                                    ? `INTL WIRE TO ${randomPerson('Italy').toUpperCase()} - ${randomChoice(italyBanks).toUpperCase()} - ${city.toUpperCase()} IT`
                                    : `INTL WIRE TO ${randomPerson('USA').toUpperCase()} - CAIXABANK - ${city.toUpperCase()} US`,
                                metadata: {
                                    beneficiary_name: randomPerson(country),
                                    beneficiary_account: country === 'Italy' ? 'IT60 X054 2811 1010 0000 0123 456' : 'ES79 2100 0813 6101 2345 6789',
                                    beneficiary_bank: country === 'Italy' ? randomChoice(italyBanks) : 'CaixaBank',
                                    swift_code: country === 'Italy' ? 'UNCRITMM' : 'CAIXESBBXXX',
                                    bank_address: `${city}`,
                                    country,
                                    city,
                                },
                                amount: Math.round(rand(150, 900) * 100) / 100,
                                category: 'Transfer',
                                referencePrefix: 'WIRE-'
                            })
                        },
                        {
                            kind: 'credit',
                            type: 'deposit',
                            make: ({ country, city }) => {
                                const last4 = String(Math.floor(1000 + Math.random() * 9000));
                                return {
                                    description: country === 'Italy'
                                        ? `CARD DEPOSIT - ****${last4} - ${city.toUpperCase()} IT`
                                        : `CARD DEPOSIT - ****${last4} - ${city.toUpperCase()} US`,
                                    metadata: {
                                        card_last4: last4,
                                        card_expiry: `${('0' + Math.ceil(rand(1, 12))).slice(-2)}/${String(new Date().getFullYear() + 2).slice(-2)}`,
                                        country,
                                        city,
                                    },
                                    amount: Math.round(rand(100, 800) * 100) / 100,
                                    category: 'Deposit',
                                    referencePrefix: 'DEP-'
                                };
                            }
                        },
                        {
                            kind: 'debit',
                            type: 'local_transfer',
                            make: ({ country, city }) => {
                                const merchant = country === 'Italy' ? 'MediaWorld' : 'Best Buy';
                                return {
                                    description: country === 'Italy'
                                        ? `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} IT`
                                        : `POS PURCHASE - ${merchant.toUpperCase()} - ${city.toUpperCase()} US`,
                                    metadata: {
                                        merchant,
                                        beneficiary_name: randomPerson(country),
                                        beneficiary_account: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                                        beneficiary_bank: country === 'Italy' ? randomChoice(italyBanks) : randomChoice(usaBanks),
                                        routing_number: country === 'Italy' ? undefined : '026009593',
                                        bank_address: `${city}`,
                                        country, city
                                    },
                                    amount: Math.round(rand(80, 600) * 100) / 100,
                                    category: 'Equipment',
                                    referencePrefix: 'LOC-'
                                };
                            }
                        },
                        {
                            kind: 'debit',
                            type: 'fee',
                            make: ({ country, city }) => ({
                                description: country === 'Italy'
                                    ? `MONTHLY MAINTENANCE FEE - ${city.toUpperCase()} IT`
                                    : `MONTHLY MAINTENANCE FEE - ${city.toUpperCase()} US`,
                                metadata: { country, city },
                                amount: Math.round(rand(2, 12) * 100) / 100,
                                category: 'Fees',
                                referencePrefix: 'FEE-'
                            })
                        },
                    ];

                    const makeTx = async (when: Date, tpl: TxTemplate, loc: { country: 'Italy' | 'USA'; city: string }) => {
                        const data = tpl.make(loc);
                        const currency = 'USD';
                        if (tpl.kind === 'credit') {
                            runningBalance += data.amount;
                            totalCredit += data.amount;
                            const meta = { ...(data.metadata || {}), currency };
                            await db.insert(transactions).values({
                                toAccountId: accountId,
                                transactionType: tpl.type,
                                amount: String(data.amount) as any,
                                description: data.description,
                                status: 'completed',
                                metadata: meta as any,
                                balance: runningBalance.toFixed(2),
                                category: data.category,
                                reference: `${data.referencePrefix}${Date.now().toString(36).toUpperCase()}`,
                                createdAt: when as any,
                            } as any);
                        } else {
                            runningBalance -= data.amount;
                            totalDebit += data.amount;
                            const meta = { ...(data.metadata || {}), currency };
                            await db.insert(transactions).values({
                                fromAccountId: accountId,
                                transactionType: tpl.type,
                                amount: String(data.amount) as any,
                                description: data.description,
                                status: 'completed',
                                metadata: meta as any,
                                balance: runningBalance.toFixed(2),
                                category: data.category,
                                reference: `${data.referencePrefix}${Date.now().toString(36).toUpperCase()}`,
                                createdAt: when as any,
                            } as any);
                        }
                    };

                    // Generate up to 20 transactions per account
                    const targetCount = 200;
                    const italyCount = 120; // approx half before 2020

                    for (let i = 0; i < italyCount; i++) {
                        const when = dateInRange(itStart, itEnd);
                        const tpl = randomChoice(templates);
                        const city = randomChoice(italyCities);
                        await makeTx(when, tpl, { country: 'Italy', city });
                    }
                    for (let i = 0; i < (targetCount - italyCount); i++) {
                        const when = dateInRange(usStart, usEnd);
                        const tpl = randomChoice(templates);
                        const city = randomChoice(usaCities);
                        await makeTx(when, tpl, { country: 'USA', city });
                    }

                    // Update account balances
                    await db.update(accounts).set({
                        balance: runningBalance.toFixed(2),
                        totalCredit: totalCredit.toFixed(2) as any,
                        totalDebit: totalDebit.toFixed(2) as any,
                    }).where(eq(accounts.id, accountId));
                }
            }
        }
    }

    // Seed Countries and States from free APIs if not already present
    const existingCountries = await db.select().from(countries);
    if (existingCountries.length === 0) {
        try {
            // 1) Fetch ISO data from RestCountries for iso2 mapping
            const rcRes = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,cca3");
            const rcJson: Array<{ name: { common: string }; cca2: string; cca3?: string }> = await rcRes.json();
            const nameToIso = new Map<string, { iso2: string; iso3?: string }>();
            rcJson.forEach(c => {
                if (c?.name?.common && c?.cca2) {
                    nameToIso.set(c.name.common.toLowerCase(), { iso2: c.cca2, iso3: c.cca3 });
                }
            });

            // 2) Fetch countries and states list from CountriesNow
            const cnRes = await fetch("https://countriesnow.space/api/v0.1/countries/states");
            const cnJson: any = await cnRes.json();
            const items: Array<{ name: string; states: Array<{ name: string; state_code?: string }> }> = cnJson?.data ?? [];

            for (const item of items) {
                const key = item.name?.toLowerCase();
                const iso = key ? nameToIso.get(key) : undefined;
                if (!iso?.iso2) {
                    // Skip countries we can't map to ISO2 to satisfy schema constraint
                    continue;
                }
                // Upsert country by iso2
                const existingCountry = await db.select().from(countries).where(eq(countries.iso2, iso.iso2));
                let countryId = existingCountry[0]?.id as number | undefined;
                if (!countryId) {
                    await db.insert(countries).values({ name: item.name, iso2: iso.iso2, iso3: iso.iso3 });
                    const [createdCountry] = await db.select().from(countries).where(eq(countries.iso2, iso.iso2));
                    countryId = createdCountry?.id as number | undefined;
                }
                if (!countryId) continue;
                // Insert states
                for (const s of item.states ?? []) {
                    const stateName = s?.name?.trim();
                    if (!stateName) continue;
                    // Avoid duplicates of same name under same country by naive existence check
                    const exists = await db.select().from(states)
                        .where(eq(states.name, stateName));
                    if (!exists.length) {
                        await db.insert(states).values({ countryId, name: stateName, code: s.state_code });
                    }
                }
            }
            console.log(`✅ Seeded ${items.length} countries with states from APIs.`);

            // 3) Fetch cities per country (best-effort; limited dataset to avoid huge requests)
            // CountriesNow provides cities by country as well
            // for (const item of items) {
            //     try {
            //         const payload = { country: item.name };
            //         const cityRes = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
            //             method: "POST",
            //             headers: { "Content-Type": "application/json" },
            //             body: JSON.stringify(payload),
            //         });
            //         const cityJson: any = await cityRes.json();
            //         const cityList: string[] = cityJson?.data ?? [];
            //         const [countryRow] = await db.select().from(countries).where(eq(countries.name, item.name));
            //         const countryId = countryRow?.id as number | undefined;
            //         if (!countryId) continue;
            //         for (const cityName of cityList) {
            //             if (!cityName) continue;
            //             const exists = await db.select().from(cities).where(eq(cities.name, cityName));
            //             if (!exists.length) {
            //                 await db.insert(cities).values({ countryId, name: cityName });
            //             }
            //         }
            //     } catch { }
            // }
            // console.log("✅ Seeded cities from APIs (best-effort).\n");
        } catch (e) {
            console.error("⚠️ Failed to fetch and seed countries/states from APIs:", e);
        }
    }
}

// Allow running via `npm run db:seed`
(async () => {
    try {
        await seedInitialData();
        console.log("✅ Seed completed.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
})();


