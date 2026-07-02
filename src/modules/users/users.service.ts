import { db } from "../../database/client"; 
import { users } from "../../database/schema/schema"; 
import { eq } from "drizzle-orm";

export interface UserProfilePayload {
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  designation?: string | null;
  address?: string | null;
  phone?: string | null;
}

export class UsersService {
  async getUserProfile(userUid: string) {
    const [user] = await db.select().from(users).where(eq(users.userUid, userUid)).limit(1);
    if (!user) throw new Error("Target account profile context does not exist.");

    const { otp, otpExpiresAt, ...secureProfile } = user;
    return secureProfile;
  }

  async saveProfileData(userUid: string, data: UserProfilePayload, imageUrl: string | null) {
    const [completedUser] = await db
      .update(users)
      .set({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        designation: data.designation,
        address: data.address,
        phone: data.phone,
        profileImageUrl: imageUrl, // Saves relative path string perfectly
        updatedAt: new Date(),
      })
      .where(eq(users.userUid, userUid))
      .returning();

    return completedUser;
  }

  async updateProfileData(userUid: string, data: UserProfilePayload, imageUrl?: string | null) {
    const fieldsToUpdate: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.username !== undefined) fieldsToUpdate.username = data.username;
    if (data.firstName !== undefined) fieldsToUpdate.firstName = data.firstName;
    if (data.lastName !== undefined) fieldsToUpdate.lastName = data.lastName;
    if (data.designation !== undefined) fieldsToUpdate.designation = data.designation;
    if (data.address !== undefined) fieldsToUpdate.address = data.address;
    if (data.phone !== undefined) fieldsToUpdate.phone = data.phone;
    
    if (imageUrl !== undefined) fieldsToUpdate.profileImageUrl = imageUrl;

    const [updatedUser] = await db
      .update(users)
      .set(fieldsToUpdate)
      .where(eq(users.userUid, userUid))
      .returning();

    return updatedUser;
  }
}