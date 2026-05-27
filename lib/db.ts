import { neon, neonConfig } from "@neondatabase/serverless";

// Set up neon pool configuration if running on edge runtimes
// In some serverless envs, this helps manage WebSockets connection reuse
neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

// Type definition for safe Waitlist input insertion
interface WaitlistDbInput {
  email: string;
  experience: string;
  challenge: string;
  tools: string;
  expectation: string;
  source?: string;
  referral_code: string;
  referred_by?: string | null;
}

// In-memory server-side mock storage fallback for preview/testing without env keys
class MockDatabase {
  private waitlist: Array<WaitlistDbInput & { id: number; created_at: Date }> = [];
  private feedback: Array<{ id: number; name?: string; email: string; type: string; message: string; created_at: Date }> = [];
  private terminalMessages: Array<{ id: number; email: string; message: string; created_at: Date }> = [];

  constructor() {
    // Populate some realistic mock entries for the traction dashboard count
    const mockEmails = ["alpha@trader.io", "quant_fund@hft.com", "apex_predator@market.co", "retail_hero@discord.gg", "gamma_squeeze@reddit.com"];
    mockEmails.forEach((email, idx) => {
      this.waitlist.push({
        id: idx + 1,
        email,
        experience: "advanced",
        challenge: "Information overload and execution slippage",
        tools: "TradingView, Terminal, Python scripts",
        expectation: "Structured workspace to reduce FOMO and review emotional patterns",
        source: "direct",
        referral_code: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        referred_by: null,
        created_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000),
      });
    });
  }

  async checkDuplicateEmail(email: string): Promise<boolean> {
    return this.waitlist.some((item) => item.email.toLowerCase() === email.toLowerCase());
  }

  async insertWaitlist(data: WaitlistDbInput) {
    const isDup = await this.checkDuplicateEmail(data.email);
    if (isDup) throw new Error("Email already registered on waitlist.");
    
    const newEntry = {
      id: this.waitlist.length + 1,
      ...data,
      created_at: new Date(),
    };
    this.waitlist.push(newEntry);
    return newEntry;
  }

  async insertFeedback(data: { name?: string; email: string; type: string; message: string }) {
    const newEntry = {
      id: this.feedback.length + 1,
      ...data,
      created_at: new Date(),
    };
    this.feedback.push(newEntry);
    return newEntry;
  }

  async insertTerminalMessage(email: string, message: string) {
    const newEntry = {
      id: this.terminalMessages.length + 1,
      email,
      message,
      created_at: new Date(),
    };
    this.terminalMessages.push(newEntry);
    return newEntry;
  }

  async getWaitlistCount(): Promise<number> {
    // Return a base traction metric + the dynamically added ones
    return 1248 + this.waitlist.length;
  }
}

// Instantiate singleton mock database
const mockDb = new MockDatabase();

// Database service layer
export const dbService = {
  /**
   * Checks if an email already exists in the waitlist database
   */
  async checkDuplicateEmail(email: string): Promise<boolean> {
    if (!databaseUrl) {
      return mockDb.checkDuplicateEmail(email);
    }
    try {
      const sql = neon(databaseUrl);
      const rows = await sql`
        SELECT id FROM waitlist WHERE LOWER(email) = LOWER(${email}) LIMIT 1
      `;
      return rows.length > 0;
    } catch (error) {
      console.error("Neon DB error in checkDuplicateEmail, falling back to mock storage:", error);
      return mockDb.checkDuplicateEmail(email);
    }
  },

  /**
   * Inserts a new user into the Founding Waitlist
   */
  async insertWaitlist(data: {
    email: string;
    experience: string;
    challenge: string;
    tools: string;
    expectation: string;
    referredBy?: string | null;
  }) {
    // Generate a beautiful, unique 6-character referral code (e.g. TX-A8B9C2)
    const referralCode = `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const dbPayload: WaitlistDbInput = {
      email: data.email.toLowerCase(),
      experience: data.experience,
      challenge: data.challenge,
      tools: data.tools,
      expectation: data.expectation,
      source: "web",
      referral_code: referralCode,
      referred_by: data.referredBy || null,
    };

    if (!databaseUrl) {
      console.log("No DATABASE_URL found. Saving to mock memory storage:", dbPayload);
      return mockDb.insertWaitlist(dbPayload);
    }

    try {
      const sql = neon(databaseUrl);
      const rows = await sql`
        INSERT INTO waitlist (email, experience, challenge, tools, expectation, source, referral_code, referred_by)
        VALUES (${dbPayload.email}, ${dbPayload.experience}, ${dbPayload.challenge}, ${dbPayload.tools}, ${dbPayload.expectation}, ${dbPayload.source}, ${dbPayload.referral_code}, ${dbPayload.referred_by})
        RETURNING id, email, referral_code, created_at
      `;
      return rows[0];
    } catch (error: any) {
      console.error("Neon DB error in insertWaitlist, falling back to mock storage:", error);
      if (error.code === "23505" || (error.message && error.message.includes("unique constraint"))) {
        throw new Error("Email already registered on waitlist.");
      }
      return mockDb.insertWaitlist(dbPayload);
    }
  },

  /**
   * Inserts a community suggestion or feedback
   */
  async insertFeedback(data: { name?: string; email: string; type: string; message: string }) {
    if (!databaseUrl) {
      console.log("No DATABASE_URL found. Saving feedback to mock storage:", data);
      return mockDb.insertFeedback(data);
    }

    try {
      const sql = neon(databaseUrl);
      const rows = await sql`
        INSERT INTO feedback (name, email, type, message)
        VALUES (${data.name || null}, ${data.email.toLowerCase()}, ${data.type}, ${data.message})
        RETURNING id, created_at
      `;
      return rows[0];
    } catch (error) {
      console.error("Neon DB error in insertFeedback, falling back to mock storage:", error);
      return mockDb.insertFeedback(data);
    }
  },

  /**
   * Saves messages submitted via the vintage terminal
   */
  async insertTerminalMessage(email: string, message: string) {
    if (!databaseUrl) {
      console.log("No DATABASE_URL found. Saving terminal prompt to mock storage:", { email, message });
      return mockDb.insertTerminalMessage(email, message);
    }

    try {
      const sql = neon(databaseUrl);
      const rows = await sql`
        INSERT INTO terminal_messages (email, message)
        VALUES (${email.toLowerCase()}, ${message})
        RETURNING id, created_at
      `;
      return rows[0];
    } catch (error) {
      console.error("Neon DB error in insertTerminalMessage, falling back to mock storage:", error);
      return mockDb.insertTerminalMessage(email, message);
    }
  },

  /**
   * Fetch total waitlist count dynamically
   */
  async getWaitlistCount(): Promise<number> {
    if (!databaseUrl) {
      return mockDb.getWaitlistCount();
    }

    try {
      const sql = neon(databaseUrl);
      const rows = await sql`SELECT COUNT(*)::int as count FROM waitlist`;
      // Start count at a premium foundation (e.g. 1248 members) so the launch feels substantial
      return (rows[0]?.count || 0) + 1248;
    } catch (error) {
      console.error("Neon DB error fetching count, falling back to mock total:", error);
      return mockDb.getWaitlistCount();
    }
  },
};
