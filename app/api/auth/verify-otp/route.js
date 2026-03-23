import { connectToDatabase } from "@/lib/dbConnection";
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import User from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";


export async function POST(request) {
    try {
        await connectToDatabase();
        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email: true, otp: true
        })
        const validateData = validationSchema.safeParse(payload)
        if (!validateData.success) {
            return response(false, 401, "Invalid request data", validateData.error)
        }
        const { email, otp } = validateData.data
        const otpRecord = await OTPModel.findOne({ email, otp })
        if (!otpRecord) {
            return response(false, 404, "Invalid or Expired OTP", { status: 404 })
        }
        // OTP is valid, delete it from the database
        const getUser = await User.findOne({ deletedAt: null, email }).lean();
        if (!getUser) {
            return response(false, 404, "User not found", { status: 404 })
        }
        const loggedInUser = {
            id: getUser._id ,
            name: getUser.name,
            email: getUser.email,
            role: getUser.role,
            avatar: getUser.avatar,
        }
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ user: loggedInUser })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);
        const cookieStore = await cookies()
        cookieStore.set({
            name: "token",
            value: token,
            httpOnly: process.env.NODE_ENV === "production",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
        })
        await OTPModel.deleteOne({ _id: otpRecord._id })
        return response(true, 200, "OTP verified successfully", { token, user: loggedInUser, status: 200 })
    } catch (error) {
        return catchError(error)
    }
}