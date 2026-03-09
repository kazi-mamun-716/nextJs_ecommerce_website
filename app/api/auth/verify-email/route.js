import { connectToDatabase } from "@/lib/dbConnection";
import { catchError, response } from "@/lib/helperFunction";
import User from "@/models/User.model";
import { jwtVerify } from "jose";

export async function POST(request) {
    try {
        await connectToDatabase();
        const { token } = await request.json();
        if(!token){
            return response(false, 400, "Token is required");
        }
        //verify token
        const decodedToken = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));
        const userId = decodedToken.payload.userId;
        //get user from database
        const user = await User.findById(userId);
        if(!user){
            return response(false, 404, "User not found");
        }
        if(user.isEmailVerified){
            return response(false, 400, "Email already verified");
        }
        user.isEmailVerified = true;
        await user.save();
        return response(true, 200, "Email verified successfully");
    } catch (error) {
        return catchError(error, "Failed to connect to database");
    }

}