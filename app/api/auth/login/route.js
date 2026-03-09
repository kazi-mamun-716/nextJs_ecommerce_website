import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import User from "@/models/User.model";
import { SignJWT } from "jose";
import { z } from "zod";

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        console.log("Login attempt with email:", email, password);
        const validationSchema = zSchema.pick({
            email: true,
        }).extend({
            password: z.string(),
        });
        const validateData = validationSchema.safeParse({ email, password });
        if (!validateData.success) {
            return response(false, 400, "Invalid email or password", validateData.error);
        }
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (!user) {
            return response(false, 401, "Invalid email or password", { status: 401 });
        }
        //resend email verification if email is not verified
        if (!user.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: user._id.toString() })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1h")
                .sign(secret);
            await sendMail(email, 'Email Verification request from Ecommerce App', emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`));
            return response(false, 403, "Your email not verified. A new verification email has been sent to your registered email.", { status: 403 });
        }
        //password verification
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return response(false, 401, "Invalid email or password", { status: 401 });
        }
        //otp generation
        await OTPModel.deleteMany({ email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTPModel.create({ email, otp });
        const otpEmailStatus = await sendMail(email, 'Your OTP for Ecommerce App Login', otpEmail(otp));
        if (!otpEmailStatus.success) {
            return response(false, 500, "Failed to send OTP email. Please try again later.", { status: 500 });
        }
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return response(true, 200, "Please verify your email to complete login.", { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return response(false, 500, "Internal server error", { status: 500 });
    }
}