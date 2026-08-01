import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

async function generateUnique8(): Promise<string> {
    while (true) {
        const candidate = Math.floor(10_000_000 + Math.random() * 90_000_000).toString();
        const existing = await db.select().from(users).where(eq(users.username, candidate));
        if (existing.length === 0) return candidate;
    }
}

async function run() {
    const all = await db.select().from(users);
    let updated = 0;
    for (const u of all) {
        if (!/^\d{8}$/.test(u.username)) {
            const newUsername = await generateUnique8();
            await db.update(users).set({ username: newUsername }).where(eq(users.id, u.id));
            updated++;
            console.log(`Updated user ${u.id} (${u.username}) -> ${newUsername}`);
        }
    }
    console.log(`Done. Updated ${updated} usernames to numeric 8-digits.`);
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });


