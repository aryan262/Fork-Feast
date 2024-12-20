import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Loader2, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const loading =false;
  return (
    <div className='flex items-center justify-center min-h-screen w-full'>
        <form className='flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4'>
            <div className="text-center">
                <h1 className='font-extrabold text-2xl mb-2'>Forgot Password</h1>
                <p className='text-sm text-gray-600'>Enter your email address to reset your password</p>
            </div>
            <div className='relative w-full'>
              <Input className="pl-10" type="text" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <Mail className='absolute inset-y-1.5 left-2 text-gray-600 pointer-events-none'/>
            </div>
            {
              loading?(<Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className='mr-2 h-4 w-4 animate-spin'/>Loading...</Button>):(
                <Button className="bg-orange hover:bg-hoverOrange">Send Reset Link</Button>
              )
            }
            <span className='text-center'>Back to {" "}
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </span>
        </form>
    </div>
  )
}

export default ForgotPassword