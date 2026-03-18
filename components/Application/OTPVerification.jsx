import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

const OTPVerification = ({email, onSubmit, loading}) => {
    const formSchema = zSchema.pick({
        otp: true, email: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "", email
        },
    })
  return (
    <div>OTPVerification</div>
  )
}

export default OTPVerification