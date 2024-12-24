import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { userSignupSchema } from '@/schema/userSchema'
import { useUserStore } from '@/store/useUserStore'
import { Contact, Loader2, LockKeyhole, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'


function Signup() {
    const [input, setInput] = useState({
        fullName:"",
        email:"",
        password:"",
        contact:""
    })
    const [errors, setErrors] = useState({});
    const {signup, loading} = useUserStore(); 
    // const loading=false;

    const navigate = useNavigate()
    const changeEventHandler = (event)=>{
        const {name, value} =  event.target;
        setInput({...input, [name]:value})
    }
    const loginSubmitHandler= async(event)=>{
        event.preventDefault();
        const result = userSignupSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors);
            return; 
        }
        try {
            await signup(input);
            navigate("/verify-email");
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }
    // const loading = false;
  return (
    <div className='flex items-center justify-center min-h-screen'>
        <form onSubmit={loginSubmitHandler} className='md:p-8 w-full max-w-md md:border border-gray-200 rounded-lg'>
            <div className='mb-4'>
                <h1 className='font-bold text-2xl text-center'>Fork&Feast</h1>
            </div>
            <div className="mb-4">
                <div className='relative'>
                    <Input type='fullName' placeholder='FullName' name='fullName' value={input.fullName} onChange={changeEventHandler} className="pl-10 focus-visible:ring-1"/>
                    <User className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none'/>
                    {
                        errors && <span className='text-sm text-red-500'>{errors.fullName}</span>
                    }
                </div>

            </div>
            <div className="mb-4">
                <div className='relative'>
                    <Input type='contact' placeholder='Phone Number' name='contact' value={input.contact} onChange={changeEventHandler} className="pl-10 focus-visible:ring-1"/>
                    <Contact className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none'/>
                    {
                        errors && <span className='text-sm text-red-500'>{errors.contact}</span>
                    }
                </div>
            </div>
            <div className="mb-4">
                <div className='relative'>
                    <Input type='email' placeholder='Email' name='email' value={input.email} onChange={changeEventHandler} className="pl-10 focus-visible:ring-1"/>
                    <Mail className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none'/>
                    {
                        errors && <span className='text-sm text-red-500'>{errors.email}</span>
                    }
                </div>
            </div>
            <div className="mb-4">
                <div className='relative'>
                    <Input type='password' name='password' placeholder='Password' value={input.password} onChange={changeEventHandler}  className="pl-10 focus-visible:ring-1"/>
                    <LockKeyhole className='absolute inset-y-2 left-2 text-gray-500 pointer-events-none'/>
                    {
                        errors && <span className='text-sm text-red-500'>{errors.password}</span>
                    }
                </div>
            </div>
            <div className="mb-10">
                {
                    loading ? (<Button disabled className='w-full bg-orange hover:bg-hoverOrange'><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait</Button>):
                    (
                        <Button type="submit" className='w-full bg-orange hover:bg-hoverOrange'>SignUp</Button>
                    )
                }
                
            </div>
            <Separator/>
            <p className='mt-2'>
                Already have an account?{" "}
                <Link to="/login" className='text-blue-500 hover:underline'>Login</Link>
            </p>
        </form>
    </div>
  )
}

export default Signup