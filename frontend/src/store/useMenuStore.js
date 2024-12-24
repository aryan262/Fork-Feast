import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import { useRestaurantStore } from './useRestaurantStore';
import axios from 'axios';
import { toast } from 'sonner';
const API_ENDPOINT = 'https://forkfeastbackend.vercel.app/api/menu'
axios.defaults.withCredentials = true;
export const useMenuStore = create()(persist((set)=>({
    loading:false,
    menu:null,
    createMenu:async(formData)=>{
        try {
            set({loading:true});
            const response = await axios.post(`${API_ENDPOINT}/`, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false, menu:response.data.menu})
            }
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    
    editMenu:async(menuId, formData)=>{
        try {
            set({loading:true});
            const response = await axios.put(`${API_ENDPOINT}/${menuId}`, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false, menu:response.data.menu})
            }
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu);
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    }
}),
{
    name:'menu-name',
    storage:createJSONStorage(()=>localStorage)
}
))