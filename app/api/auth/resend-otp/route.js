import { otpEmail } from "@/email/otpEmail";
import { connectToDatabase } from "@/lib/dbConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import User from "@/models/User.model";

export async function POST(request) {
    try {
        await connectToDatabase();
        const { email } = await request.json();
        const validationSchema = zSchema.pick({ email: true });
        const validateData = validationSchema.safeParse({ email });
        if (!validateData.success) {
            return response(false, 400, "Invalid or missing email", validateData.error);
        }
        // Here you would typically check if the email exists in your database and resend the OTP
        const getUser = await User.findOne({ deletedAt: null, email }).lean();
        if (!getUser) {
            return response(false, 404, "User not found", { status: 404 });
        }
        // remove old OTP and generate new OTP and send email
        await OTPModel.deleteMany({ email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTPModel.create({ email, otp });
        //send otp email
        const otpEmailStatus = await sendMail(email, 'Your OTP for Ecommerce App Login', otpEmail(otp));
        if (!otpEmailStatus.success) {
            return response(false, 500, "Failed to send OTP email. Please try again later.", { status: 500 });
        }
        return response(true, 200, "OTP resent successfully", { status: 200 });
    } catch (error) {
        console.error("Resend OTP error:", error);
        return catchError(error);
    }
}