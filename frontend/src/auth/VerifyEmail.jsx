import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/store/useUserStore';
import { Loader2 } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
    const [otp, setOtp]=useState(["", "", "", "", "", ""])
    const inputRef = useRef([]);
    const {loading, verifyEmail} = useUserStore()
    const navigate = useNavigate();
    // const loading = false;
    const handleChange=(index, value)=>{
        if(/^[a-zA-Z0-9]$/.test(value) || value===""){
            const newOtp = [...otp];
            newOtp[index]=value;
            setOtp(newOtp);
        }
        if(value!=="" && index<5){
            inputRef.current[index+1].focus();
        }
    }
    const handleKeydown=(index, event)=>{
        if(event.key==='Backspace' && !otp[index]&&index>0){
            inputRef.current[index-1].focus();
        }
    }

    const submitHandler = async(event)=>{
        event.preventDefault();
        const verificationcode = otp.join("");
        try {
            await verifyEmail(verificationcode);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='flex items-center justify-center h-screen w-full'>
        <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-500">
            <div className="text-center">
                <h1 className='font-bold text-2xl'>Verify Your Email</h1>
                <p className='text-sm text-gray-600'>Enter the reset code sent to your Email</p>
            </div>
            <form onSubmit={submitHandler}>
                <div className='flex justify-between'>
                    {
                        otp.map((letter, index)=>(
                            <Input type="text" ref={(element)=>(inputRef.current[index]=element)} key={index} value={letter} onKeyDown={(event)=>handleKeydown(index, event)} maxLength={1} onChange={(e)=>handleChange(index, e.target.value)} className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:border-2 focus:ring-8 focus:ring-indigo-500" />
                        ))
                    }
                </div>
                {
                    loading?(<Button disabled className='bg-orange hover:bg-hoverOrange mt-6 w-full'>
                        <Loader2 className='mr-1 w-4 h-4 animate-spin'/>
                        Please wait
                    </Button>):
                    (
                        <Button className='bg-orange hover:bg-hoverOrange mt-6 w-full'>Verify</Button>
                    )
                }
            </form>
        </div>
    </div>
  )
}

export default VerifyEmail