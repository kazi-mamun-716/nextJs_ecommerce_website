import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    },
}, { timestamps: true });

//after expiration, the document will be automatically removed from the collection
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.model.OTP || mongoose.model("OTP", otpSchema, "otps");
export default OTPModel;