import { NextResponse } from "next/server"

export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success,
        statusCode,
        message,
        data,
    }, { status: statusCode });
};

export const catchError = (error, customMessage) => {
    //handle duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern).join(", ");
        error.message = `Duplicate key error: ${field} already exists, please use a different ${field}`;
        return response(false, 409, error.message);
    }
    let errorObj = {}
    if (process.env.NODE_ENV === "development") {
        errorObj = {
            message: error.message,
            error
        }
    }else{
        errorObj = {
            error,
            message: customMessage || "Internal Server Error",
        }
    }
    return response(false, error.code, ...errorObj);
}