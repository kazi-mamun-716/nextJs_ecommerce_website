"use client"
import { Card, CardContent } from '@/components/ui/card'
import Logo from "@/public/assets/images/logo-black.png"
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { z } from 'zod'
import { useState } from 'react'
import Link from 'next/link'
import {LOGIN_ROUTE } from '@/routes/websiteRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OTPVerification from '@/components/Application/OTPVerification'

const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState()
    const formSchema = zSchema.pick({
        email: true,
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })
    const handleEmailVerification = async (values) => {}
    //otp verification handler
  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true)
      const { data: otpVerificationResponse } = await axios.post("/api/auth/verify-otp", values)
      if (!otpVerificationResponse.success) {
        throw new Error(otpVerificationResponse.message)
      }
      setOtpEmail('')
      showToast(otpVerificationResponse.message, "success")

      dispatch(login(otpVerificationResponse.data.user)) // Update Redux store with user data
    } catch (error) {
      showToast(error.message || "Failed to verify OTP", "error")
    } finally {
      setOtpVerificationLoading(false)
    }
  }
  return (
    <Card className='w-[400px]'>
      <CardContent>
        <div className="flex justify-center">
          <Image src={Logo} alt="Logo" width={Logo.width} height={Logo.height} className='max-w-[150px]' />
        </div>
        {
          !otpEmail ? <>
            <div className='text-center'>
              <h1 className='tex-4xl font-bold'>Reset Password</h1>
              <p>Enter Your Email for Password Reset</p>
            </div>
            <div className='mt-6 mb-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailVerification)} className="space-y-6">

                  <div className='mb-3'>
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type='email' placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <ButtonLoading
                    type="submit"
                    text="Send OTP"
                    loading={emailVerificationLoading}
                    className={'w-full cursor-pointer'}
                    onClick={form.handleSubmit(handleEmailVerification)}
                  />

                </form>
              </Form>
            </div>
            <div className='text-center'>              
              <Link href={LOGIN_ROUTE} className="text-blue-500 hover:underline">Back To Login</Link>
            </div>
          </> : <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification} />
        }
      </CardContent>
    </Card>
  )
}

export default ResetPassword