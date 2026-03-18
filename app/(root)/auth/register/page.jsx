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
import { FaRegEyeSlash } from 'react-icons/fa'
import { FaRegEye } from 'react-icons/fa6'
import { LOGIN_ROUTE } from '@/routes/websiteRoutes'
import { catchError } from '@/lib/helperFunction'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setTypePassword] = useState(true)
    const [isTypeConfirmPassword, setTypeConfirmPassword] = useState(true)
    const formSchema = zSchema.pick({
        name: true,
        email: true,
        password: true,
    }).extend({
        confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password and confirm password must match",
        path: ["confirmPassword"],
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
        },
    })
    const onSubmit = async (values) => {
        try {
            setLoading(true)
            const {data: registerResponse} = await axios.post("/api/auth/register", values)
            if(!registerResponse.success){
                throw new Error(registerResponse.message)
            }
            form.reset()
            showToast(registerResponse.message, "success")
        } catch (error) {
            showToast(error.message || "Failed to register user", "error")
        } finally {
            setLoading(false)
        }
    }
    return (
        <Card className='w-[400px]'>
            <CardContent>
                <div className="flex justify-center">
                    <Image src={Logo} alt="Logo" width={Logo.width} height={Logo.height} className='max-w-[150px]' />
                </div>
                <div className='text-center'>
                    <h1 className='tex-4xl font-bold'>Create New Account</h1>
                    <p>Create your account by filling out the form below</p>
                </div>
                <div className='mt-6 mb-6'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className='mb-3'>
                                {/* Full Name Field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Enter your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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

                            <div className='mb-3'>
                                {/* Confirm Password Field */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className='relative'>
                                                    <Input
                                                        type={isTypeConfirmPassword ? "password" : "text"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setTypeConfirmPassword(!isTypeConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                                    >
                                                        {isTypeConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
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
                                text="Create Account"
                                loading={loading}
                                className={'w-full cursor-pointer'}
                                onClick={form.handleSubmit(onSubmit)}
                            />

                        </form>
                    </Form>
                </div>
                <div className='text-center'>
                    <p>Already Registered? <Link href={LOGIN_ROUTE} className="text-blue-500 hover:underline">Login to your Account</Link></p>
                </div>
            </CardContent>
        </Card>
    )
}

export default Register