import { eq, desc } from "drizzle-orm";
import { db } from "../../database/client";
import { users } from "../../database/schema/schema";

type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class AuthRepository {
  private getClient(tx?: TransactionClient) {
    return tx || db;
  }

  async withTransaction<T>(callback: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return await db.transaction(async (tx) => {
      return await callback(tx);
    });
  }

  async findByEmail(email: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result[0] || null;
  }

  async createPendingUser(email: string, otp: string, otpExpiresAt: Date, tx?: TransactionClient) {
    const client = this.getClient(tx);
    const result = await client
      .insert(users)
      .values({
        email,
        otp,
        otpExpiresAt,
        isEmailVerified: false,
      })
      .returning();
    return result[0];
  }

  async updateOtp(email: string, otp: string, otpExpiresAt: Date, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(users)
      .set({ otp, otpExpiresAt })
      .where(eq(users.email, email));
  }

  async clearOtp(email: string, tx?: TransactionClient) {
    const client = this.getClient(tx);
    await client
      .update(users)
      .set({
        otp: null,
        otpExpiresAt: null,
      })
      .where(eq(users.email, email));
  }

  async completeSignup(
    data: {
      email: string;
      userUid: string;
      firstName: string;
      lastName: string;
      accountType: "Admin" | "Driver" | "Vehicle Owner" | "User";
      isEmailVerified: boolean;
    },
    tx?: TransactionClient
  ) {
    const client = this.getClient(tx);
    const result = await client
      .update(users)
      .set({
        userUid: data.userUid,
        firstName: data.firstName,
        lastName: data.lastName,
        accountType: data.accountType,
        isEmailVerified: data.isEmailVerified,
        otp: null,
        otpExpiresAt: null,
      })
      .where(eq(users.email, data.email))
      .returning();
    return result[0];
  }

  async getLastUserUid(tx?: TransactionClient): Promise<string | null> {
    const client = this.getClient(tx);
    const result = await client
      .select({ userUid: users.userUid })
      .from(users)
      .orderBy(desc(users.userUid))
      .limit(1);

    return result[0]?.userUid || null;
  }
}

export const authRepository = new AuthRepository();