import { connectToDatabase } from "@/lib/dbConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import User from "@/models/User.model"

export async function POST(request) {
    try {
        await connectToDatabase()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email: true,
        })
        const validatedData = validationSchema.safeParse({ email: payload.email })
        if (!validatedData.success) {
            return response(false, "Invalid or missing email", validatedData.error, 400)
        }
        const {email} = validatedData.data;
        const getUser = await User.findOne({ email, deletedAt: null }).lean()
        if (!getUser) {
            return response(false, "User not found with the provided email", null, 404)
        }
    } catch (error) {
        console.error("Error in sending OTP:", error)
        catchError(error)
    }
}