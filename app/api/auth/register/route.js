import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectToDatabase } from "@/lib/dbConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import User from "@/models/User.model";
import { SignJWT } from "jose";
import {z} from "zod";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectToDatabase();
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true,
        }).extend({
            confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
        }).refine((data) => data.password === data.confirmPassword, {
            message: "Password and confirm password must match",
        });
        const payload = await request.json();
        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(false, 401, "Validation failed", { errors: validatedData.error });
        }
        const { name, email, password } = validatedData.data;
        // Check if user already exists
        const existingUser = await User.exists({ email });
        if (existingUser) {
            return response(false, 409, "User with this email already registered");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ userId: newUser._id.toString() })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secret);
        await sendMail(email, 'Email Verification request from Ecommerce App', emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)); 
        const responseData = {
            userId: newUser._id.toString(),
            token,
        };
        return response(true, 201, "Registration successfully, please check your email to verify your account", responseData);
    } catch (error) {
        catchError(error, "Failed to register user");
    }
}