"use client"
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { use, useEffect, useState } from 'react'
import verifedImg from "@/public/assets/images/verified.gif"
import verificationFaildImg from "@/public/assets/images/verification-failed.gif"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HOME_ROUTE } from '@/routes/websiteRoutes';

const VerifyEmail = ({ params }) => {
    const { token } = use(params);
    const [isVerified, setIsVerified] = useState(false);
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const { data: verificationResponse } = await axios.post("/api/auth/verify-email", { token });
                if (verificationResponse.success) {
                    setIsVerified(true);                    
                }
            } catch (error) {
                setIsVerified(false);
                // console.error("Email verification failed:", error);
            }
        };
        if (token) {
            verifyEmail();
        }
    }, [token]);
    return (
        <Card className='w-[400px]'>
            <CardContent>
                {isVerified ? (
                    <div>                        
                        <Image src={verifedImg} alt="Verified" width={verifedImg.width} height={verifedImg.height} className='mx-auto h-[100px] w-auto' />
                        <div className='mt-4 text-center'>
                            <h2 className='text-green-500 text-lg font-semibold mb-4'>Email verified successfully!</h2>
                            <Button asChild>
                                <Link href={HOME_ROUTE} className='w-full'>
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>                        
                        <Image src={verificationFaildImg} alt="Verification Failed" width={verificationFaildImg.width} height={verificationFaildImg.height} className='mx-auto h-[100px] w-auto' />
                        <div className='mt-4 text-center'>
                            <h2 className='text-red-500 text-lg font-bold mb-4'>Email verification failed. Please try again.</h2>
                            <Button asChild>
                                <Link href={HOME_ROUTE} className='w-full'>
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default VerifyEmail