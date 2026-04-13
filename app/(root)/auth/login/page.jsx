"use client"
import { Card, CardContent } from '@/components/ui/card'
import Logo from "@/public/assets/images/logo-black.png"
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import { Button } from "@/components/ui/button"
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
import { FaRegEyeSlash } from 'react-icons/fa'
import { FaRegEye } from 'react-icons/fa6'
import { REGISTER_ROUTE, RESET_PASSWORD_ROUTE } from '@/routes/websiteRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OTPVerification from '@/components/Application/OTPVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'

function Login() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
  const [isTypePassword, setTypePassword] = useState(true)
  const [otpEmail, setOtpEmail] = useState()
  const formSchema = zSchema.pick({
    email: true,
  }).extend({
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: loginResponse } = await axios.post("/api/auth/login", values)
      if (!loginResponse.success) {
        throw new Error(loginResponse.message)
      }
      setOtpEmail(values.email)
      form.reset()
      showToast(loginResponse.message, "success")
    } catch (error) {
      showToast(error.message || "Failed to login user", "error")
    } finally {
      setLoading(false)
    }
  }
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
              <h1 className='tex-4xl font-bold'>Login Into Account</h1>
              <p>Login into your account by filling out the form below</p>
            </div>
            <div className='mt-6 mb-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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

                  <div className='mb-3'>
                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                type={isTypePassword ? "password" : "text"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setTypePassword(!isTypePassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              >
                                {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <ButtonLoading
                    type="submit"
                    text="Login"
                    loading={loading}
                    className={'w-full cursor-pointer'}
                    onClick={form.handleSubmit(onSubmit)}
                  />

                </form>
              </Form>
            </div>
            <div className='text-center'>
              <p>Don't have an account? <Link href={REGISTER_ROUTE} className="text-blue-500 hover:underline">Create Account</Link></p>
              <Link href={RESET_PASSWORD_ROUTE} className="text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
          </> : <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification} />
        }
      </CardContent>
    </Card>
  )
}

export default Login