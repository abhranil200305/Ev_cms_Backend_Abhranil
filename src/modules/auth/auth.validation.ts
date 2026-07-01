import { z } from "zod";

export const sendOtpSchema = z.object({
    email: z.string().email(),
});

export const verifySignupSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    accountType: z.enum([
        "User",
        "Driver",
        "Vehicle Owner",
    ]),
});

export const verifyLoginSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
});