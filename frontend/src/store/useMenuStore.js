import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import { useRestaurantStore } from './useRestaurantStore';
const API_ENDPOINT = 'https://forkfeast.vercel.app/api/menu'
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
            useRestaurantStore.getState().addMenutoRestaurant(response.data.menu);
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    
    editMenu:async(menuId, formData)=>{
        try {
            set({loading:true});
            const response = await axios.put(`${API_ENDPOINT}/${menu}`, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false, menu:response.data.menu})
            }
            useRestaurantStore.getState().updateMenutoRestaurant(response.data.menu);
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    }
}),
{
    name:'menuName',
    storage:createJSONStorage(()=>localStorage)
}
))