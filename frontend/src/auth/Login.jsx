import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { userLoginSchema } from '@/schema/userSchema'
import { useUserStore } from '@/store/useUserStore'
import { Loader2, LockKeyhole, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [input, setInput] = useState({
        email:"",
        password:""
    })
    const [errors, setErrors] = useState({});
    const {login, loading} = useUserStore();
    // const loading=false;
    const navigate = useNavigate();
    const changeEventHandler = (event)=>{
        const {name, value} =  event.target;
        setInput({...input, [name]:value})
    }
    const loginSubmitHandler= async(event)=>{
        event.preventDefault();
        const result = userLoginSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors);
            return;
        }
    // await login(input);
        try {
            await login(input);
            navigate("/");
        } catch (error) {
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
                        <Button type="submit" className='w-full bg-orange hover:bg-hoverOrange'>Login</Button>
                    )
                }
                <div className="mt-4 text-center"> 
                    <Link to="/forgot" className='mt-8 text-blue-800 hover:underline'>Forgot Password</Link>
                </div>
                
            </div>
            <Separator/>
            <p className='mt-2 text-center'>
                Don't have an account?{" "}
                <Link to="/signup" className='text-blue-500 hover:underline'>SignUp</Link>
            </p>
        </form>
    </div>
  )
}

export default Login