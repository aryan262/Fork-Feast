import axios from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

const API_ENDPOINT = 'https://forkfeastbackend.vercel.app/api/user'
axios.defaults.withCredentials = true;
export const useUserStore = create()(persist((set)=>({
    user:null,
    isAuthenticated:false,
    isCheckingAuth:true,
    loading:false,
    signup:async(input)=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_ENDPOINT}/signup`, input, {
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false, user:response.data.user, isAuthenticated:true})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    login:async(input)=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_ENDPOINT}/login`, input, {
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                console.log(response.data);
                toast.success(response.data.message)
                set({loading:false, user:response.data.user, isAuthenticated:true})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    verifyEmail:async(verificationCode)=>{
        try {
            set({isCheckingAuth:true});
            const response = await axios.post(`${API_ENDPOINT}/verifyemail`, {verificationCode},{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false, user:response.data.user, isAuthenticated:true, isCheckingAuth:false})
            }
            // return response.data;
        } catch (error) {
            set({loading:false, isAuthenticated:false, isCheckingAuth:false})
            toast.error(error.response.data.message)
        }
    },
    checkAuthentication:async()=>{
        try {
            set({isCheckingAuth:true});
            const response = await axios.get(`${API_ENDPOINT}/checkauth`);
            if(response.data.success){
                // console.log(response.data);
                set({user:response.data.user, isAuthenticated:true, isCheckingAuth:false})
                toast.success(response.data.message)
            }
        } catch (error) {
            // toast.error(error.response)
            set({isAuthenticated:true, isCheckingAuth:false})
        }
    },
    logout:async()=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_ENDPOINT}/logout`);
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false, user:null, isAuthenticated:false})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    forgotPassword:async()=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_ENDPOINT}/forgotPassword`, {email});
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    resetPassword:async(token, newPassword)=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_ENDPOINT}/resetPassword/${token}`, {newPassword});
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    updateProfile:async(input)=>{
        try {
            const response = await axios.put(`${API_ENDPOINT}/profile/update`, input,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({user:response.data.user, isAuthenticated:true})
            }
        } catch (error) {
            toast.error(error.response.message)
        }
    },
}),
{
    name:'userName',
    storage:createJSONStorage(()=>localStorage)
}))