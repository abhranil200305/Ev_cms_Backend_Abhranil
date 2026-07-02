import { z } from "zod";

export const createProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    designation: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    phone: z.string().min(10),
  }),
});