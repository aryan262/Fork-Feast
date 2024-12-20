import { create } from 'zustand'
import axios from 'axios';
import {createJSONStorage, persist} from 'zustand/middleware'
const API_ENDPOINT = 'https://forkfeast.vercel.app/api/order'
axios.defaults.withCredentials = true;
export const useOrderStore = create()(persist((set)=>({
    loading:false,
    orders:[],
    createCheckoutSession:async(checkOutSession)=>{
        try {
            set({loading:true})
            const response = await axios.post(`${API_ENDPOINT}/checkout/createCheckoutSession`, checkOutSession, {
                headers:{
                    'Content-Type':'application/json'
                }
            })
            window.location.href = response.data.session.url
            set({loading:false})
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    getOrderDetails:async()=>{
        try {
            set({loading:true})
            const response = await axios.get(`${API_ENDPOINT}/`)
            set({loading:false, orders:response.data.orders})
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    }
}),
{
    name:'orderName',
    storage:createJSONStorage(()=>localStorage)
}))