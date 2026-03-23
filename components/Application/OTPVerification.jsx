import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ButtonLoading from './ButtonLoading'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const OTPVerification = ({ email, onSubmit, loading }) => {
    const [isResendingOtp, setIsResendingOtp] = useState(false);
    const formSchema = zSchema.pick({
        otp: true, email: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "", email
        },
    })
    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }
    const resendOTP = async () => {
        try {
            setIsResendingOtp(true)
            const { data: otpSendingResponse } = await axios.post("/api/auth/resend-otp",{ email })
            if (!otpSendingResponse.success) {
                throw new Error(otpSendingResponse.message)
            }
            showToast(otpSendingResponse.message, "success")
        } catch (error) {
            showToast(error.message || "Failed to resend OTP", "error")
        } finally {
            setIsResendingOtp(false)
        }
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
                        <p className="text-gray-600 text-md">Enter the OTP sent to your registered email address. The OTP valid for 10 minutes only.</p>
                    </div>
                    <div className='my-5 flex items-center justify-center'>
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>One Time Password (OTP)</FormLabel>
                                    <FormControl>
                                        <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot className='text-xl size-10' index={0} />
                                                <InputOTPSlot className='text-xl size-10' index={1} />
                                                <InputOTPSlot className='text-xl size-10' index={2} />
                                                <InputOTPSlot className='text-xl size-10' index={3} />
                                                <InputOTPSlot className='text-xl size-10' index={4} />
                                                <InputOTPSlot className='text-xl size-10' index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <ButtonLoading
                            type="submit"
                            text="Verify OTP"
                            loading={loading}
                            className={'w-full cursor-pointer'}
                            onClick={form.handleSubmit(onSubmit)}
                        />
                        <div className="text-center">
                            {
                                !isResendingOtp?<button  type='button' className='text-blue-500 hover:underline cursor-pointer mt-3' onClick={resendOTP}>
                                Resend OTP
                            </button>:<span className='text-md'>Resending.....</span>
                            }
                        </div>

                    </div>

                </form>
            </Form>
        </div>
    )
}

export default OTPVerification