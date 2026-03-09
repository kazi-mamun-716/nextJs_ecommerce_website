import { z } from 'zod'

export const zSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(
            /^[a-zA-Z\s.'-]+$/,
            "Name can only contain letters, spaces, ., ' and -"
        ),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[A-Z]/, "Must include one uppercase letter")
        .regex(/[a-z]/, "Must include one lowercase letter")
        .regex(/[0-9]/, "Must include one number"),
});