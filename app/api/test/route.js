import { connectToDatabase } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connectToDatabase();
    console.log("Database connection successful");
    try {
        return NextResponse.json({
            success: true,
            message: "Database connection successful"
        });
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: "Database connection failed",
            error: error.message
        }, { status: 500 });
    }
}