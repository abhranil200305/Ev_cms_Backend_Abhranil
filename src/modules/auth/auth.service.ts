// src/modules/auth/auth.service.ts

import { authRepository } from "./auth.repository";
import { generateOtp, otpExpiry } from "./utils/otp";
import { generateJwt } from "./utils/jwt";
import { sendOtpMail } from "./utils/mail";

import { SendOtpDto } from "./dto/sendOtp.dto";
import { VerifySignupOtpDto, VerifyLoginOtpDto } from "./dto/verifyOtp.dto";

type TransactionClient = Parameters<Parameters<typeof authRepository.withTransaction>[0]>[0];

class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
    }
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

class AuthService {
    // ==========================================
    // SIGNUP FLOW
    // ==========================================

    /**
     * Initiates the signup process by verifying the email doesn't exist,
     * generating a secure OTP, saving it, and emailing it to the user.
     */
    async sendSignupOtp(data: SendOtpDto): Promise<{ success: boolean; message: string }> {
        const { email } = data;
        const existingUser = await authRepository.findByEmail(email);
        
        if (existingUser) {
            if (existingUser.isEmailVerified) {
                throw new ConflictError("Email is already registered.");
            }
            
            const otp = generateOtp();
            const expiry = otpExpiry();
            await authRepository.updateOtp(email, otp, expiry);
            await sendOtpMail(email, otp);

            return {
                success: true,
                message: "Signup verification OTP resent successfully.",
            };
        }

        const otp = generateOtp();
        const expiry = otpExpiry(); 

        await authRepository.createPendingUser(email, otp, expiry);
        await sendOtpMail(email, otp);

        return {
            success: true,
            message: "Signup verification OTP sent successfully.",
        };
    }

    /**
     * Validates the signup OTP and updates the user record into a verified placeholder state.
     * Separates account verification from profile step creation.
     */
    async verifySignupOtp(data: VerifySignupOtpDto): Promise<{ user: any; token: string }> {
        const { email, otp, accountType } = data; 

        return await authRepository.withTransaction(async (tx: TransactionClient) => {
            // 1. Retrieve the target user state
            const user = await authRepository.findByEmail(email, tx);
            this.validateOtp(user, otp);

            // 2. Generate a sequential EV system UID
            const userUid = await this.generateUserUid(tx);

            // 3. Update the user record to a verified placeholder with no name yet
            const updatedUser = await authRepository.completeSignup({
                email,
                userUid,
                accountType,
                isEmailVerified: true
            }, tx);

            // 4. Instantly clear used token to prevent replay actions
            await authRepository.clearOtp(email, tx);

            // 5. Issue access credentials
            const token = this.createJwt(updatedUser);

            return {
                user: {
                    id: updatedUser.id,
                    userUid: updatedUser.userUid,
                    email: updatedUser.email,
                    accountType: updatedUser.accountType
                },
                token
            };
        });
    }

    // ==========================================
    // LOGIN FLOW
    // ==========================================

    /**
     * Validates if the user exists and is verified before sending a login OTP.
     */
    async sendLoginOtp(data: SendOtpDto): Promise<{ success: boolean; message: string }> {
        const { email } = data;
        const user = await authRepository.findByEmail(email);
        
        if (!user) {
            throw new NotFoundError("No account found with this email address.");
        }

        if (!user.isEmailVerified) {
            throw new BadRequestError("Email is not verified. Please complete signup verification.");
        }

        const otp = generateOtp();
        const expiry = otpExpiry();

        await authRepository.updateOtp(email, otp, expiry);
        await sendOtpMail(email, otp);

        return {
            success: true,
            message: "Login verification OTP sent successfully.",
        };
    }

    /**
     * Confirms the login OTP, clears the single-use token, and issues a fresh session JWT.
     */
    async verifyLoginOtp(data: VerifyLoginOtpDto): Promise<{ token: string; user: any }> {
        const { email, otp } = data;

        return await authRepository.withTransaction(async (tx: TransactionClient) => {
            const user = await authRepository.findByEmail(email, tx);
            this.validateOtp(user, otp);
            
            await authRepository.clearOtp(email, tx);
            const token = this.createJwt(user);

            return { 
                token,
                user: {
                    id: user.id,
                    userUid: user.userUid,
                    email: user.email,
                    accountType: user.accountType // 💡 Removed firstName & lastName here as requested
                }
            };
        });
    }

    // ==========================================
    // HELPER BUSINESS METHODS
    // ==========================================

    /**
     * Validates an OTP transaction state against current time metrics.
     */
    private validateOtp(user: any, otp: string): void {
        if (!user) {
            throw new NotFoundError("User verification record not found.");
        }
        if (!user.otp) {
            throw new BadRequestError("No active OTP requests found for this account.");
        }
        if (user.otp !== otp) {
            throw new UnauthorizedError("The verification code provided is incorrect.");
        }
        if (!user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
            throw new UnauthorizedError("The verification code has expired. Please request a new one.");
        }
    }

    /**
     * Generates a sequential ID using custom database logic.
     */
    private async generateUserUid(tx?: TransactionClient): Promise<string> {
        const lastUid = await authRepository.getLastUserUid(tx); 
        if (!lastUid) {
            return "USR100001";
        }

        const numericPart = parseInt(lastUid.replace("USR", ""), 10);
        const nextNumber = numericPart + 1;
        return `USR${nextNumber}`;
    }

    /**
     * Orchestrates payload design details before handing it to the raw sign implementation.
     */
    private createJwt(user: any): string {
        const payload = {
            id: user.id,
            userUid: user.userUid,
            email: user.email,
            accountType: user.accountType,
        };
        return generateJwt(payload);
    }
}

export const authService = new AuthService();