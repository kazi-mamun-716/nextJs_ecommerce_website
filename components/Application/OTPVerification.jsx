import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import ButtonLoading from './ButtonLoading'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

const OTPVerification = ({ email, onSubmit, loading }) => {
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
                            <button type='button' className='text-blue-500 hover:underline cursor-pointer mt-3' onClick={form.handleSubmit(onSubmit)}>
                                Resend OTP
                            </button>
                        </div>

                    </div>

                </form>
            </Form>
        </div>
    )
}

export default OTPVerification