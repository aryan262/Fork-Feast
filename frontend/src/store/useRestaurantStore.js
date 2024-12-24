import axios from 'axios'
import { toast } from 'sonner';
import { create } from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
const API_ENDPOINT = 'https://forkfeastbackend.vercel.app/api/restaurant'
axios.defaults.withCredentials = true;
export const useRestaurantStore = create()(persist((set, get)=>({
    loading:false,
    restaurant:null,
    searchedRestaurant:null,
    appliedFilter:[],
    singleRestaurant:null,
    restaurantOrder:[],
    createRestaurant:async(formData)=>{
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
                set({loading:false})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    getRestaurant:async()=>{
        try {
            set({loading:true});
            const response = await axios.get(`${API_ENDPOINT}/`);
            if(response.data.success){
                // console.log(response.data);
                set({loading:false, restaurant:response.data.restaurant})
                // toast.success(response.data.message)
            }
        } catch (error) {
            if(error.response.status===404){
                set({restaurant:null})
            }
            // toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    updateRestaurant:async(formData)=>{
        try {
            set({loading:true});
            const response = await axios.put(`${API_ENDPOINT}/`, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            if(response.data.success){
                // console.log(response.data);
                toast.success(response.data.message)
                set({loading:false})
            }
        } catch (error) {
            // toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    searchRestaurant:async(searchText, searchQuery, selectedCuisines)=>{
        try {
            set({loading:true});
            const params = new URLSearchParams();
            params.set("searchQuery", searchQuery)
            params.set("selectedCuisines", selectedCuisines.join(","))
            // await new Promise((resolve)=>setTimeout(resolve, 2000));
            const response = await axios.get(`${API_ENDPOINT}/search/${searchText}?${params.toString()}`)
            if(response.data.success){
                console.log(response.data);
                set({loading:false, searchedRestaurant:response.data})
                toast.success(response.data)
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    addMenuToRestaurant:(menu)=>{
        set((state)=>({
            restaurant:state.restaurant ? {...state.restaurant, menus:[...state.restaurant.menus, menu]}:null,

        }))
    },
    updateMenuToRestaurant:(updatedMenu)=>{
        set((state)=>{
            if(state.restaurant){
                const updatedMenuList= state.restaurant.menus.map((menu)=>menu._id===updatedMenu._id?updatedMenu:menu);
                return {restaurant: {...state.restaurant, menus:updatedMenuList}}
            }
        })
        return state;
    },
    setAppliedFilters:(value)=>{
        set((state)=>{
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item)=>item!==value):[...state.appliedFilter, value];
            return {appliedFilter:updatedFilter};
        })
    },
    resetAppliedFilter:()=>{
        set({appliedFilter:[]})
    },
    getSingleRestaurant:async(restaurantId)=>{
        try {
            const response = await axios.get(`${API_ENDPOINT}/${restaurantId}`)
            if(response.data.success){
                set({singleRestaurant:response.data.restaurant})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    getRestaurantOrders:async()=>{
        try {
            const response = await axios.get(`${API_ENDPOINT}/orders`)
            if(response.data.success){
                set({restaurantOrder:response.data.orders})
            }
        } catch (error) {
            toast.error(error.response.data.message)
            // set({loading:false})
        }
    },
    updateRestaurantOrder:async(orderId, status)=>{
        try {
            const response = await axios.put(`${API_ENDPOINT}/orders/${orderId/status}`, {status}, {
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                const updatedorder = get().restaurantOrder.map((order)=>{
                    return order._id===orderId ? {...order, status:response.data.status}:order;
                })
                set({restaurantOrder:updatedorder});
                toast.success(response.data.message)
            }
            
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}),
{
    name:'restaurant-name',
    storage:createJSONStorage(()=>localStorage)
}
))