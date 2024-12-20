import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { restaurantFormSchema } from '@/schema/restaurantSchema';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function Restaurant() {
  const [input, setInput] = useState({
    restaurantName:"",
    city:"",
    country:"",
    deliveryTime:0,
    cuisines:[],
    imageFile:undefined
  })
  const changeEventHandler = (event)=>{
    const {name, value, type} = event.target;
    setInput({...input, [name]:type==='number'?Number(value):value});
  }

  const [errors, setErrors] = useState({})
  const {loading, restaurant, createRestaurant, updateRestaurant, getRestaurant} = useRestaurantStore();
  // const restaurantispresent = true;
  const onSubmitHandler=async(event)=>{
    event.preventDefault(); 
    const result = restaurantFormSchema.safeParse(input);
    if(!result.success){
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("restaurantName", input.restaurantName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("deliveryTime", input.deliveryTime.toString());
      formData.append("cuisines", JSON.stringify(input.cuisines));
      if(input.imageFile){
        formData.append("imageFile", input.imageFile);
      }
      if(restaurant){
        await updateRestaurant(formData)
      }
      else{
        await createRestaurant(formData)
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  useEffect(()=>{
    const fetchRestaurant = async()=>{
      await getRestaurant();
      setInput({
        restaurantName:restaurant.restaurantName || "",
        city: restaurant.city||"",
        country:restaurant.country||"",
        deliveryTime:restaurant.deliveryTime||0,
        cuisines:restaurant.cuisines? restaurant.cuisines.map((cuisine)=>cuisine) :[],
        imageFile:undefined
      })
    }
    fetchRestaurant();
  },[])

  return (
    <div className='max-w-6xl mx-auto my-10'>
      <div>
        <div>
          <h1 className='font-extrabold text-2xl mb-5'>Add Restaurants</h1>
          <form onSubmit={onSubmitHandler}>
            <div className="md:grid grid-cold-2 gap-6 space-y-2 md:space-y-0">
              <div>
                <Label>Restaurant Name</Label>
                <Input type="text" name="restaurantName" onChange={changeEventHandler} value={input.restaurantName} placeholder="Enter your restaurant name" />
                {errors&& <span className='text-xs text-red-600 font-medium'>{errors.restaurantName}</span>}
              </div>
              <div>
                <Label>City</Label>
                <Input type="text" name="city" value={input.city} onChange={changeEventHandler} placeholder="Enter your city" />
                {errors&& <span className='text-xs text-red-600 font-medium'>{errors.city}</span>}
              </div>
              <div>
                <Label>Country</Label>
                <Input type="text" name="country" value={input.country} onChange={changeEventHandler} placeholder="Enter your country" />
                {errors&& <span className='text-xs text-red-600 font-medium'>{errors.country}</span>}
              </div>
              <div>
                <Label>Estimated Delivery Time (in minutes)</Label>
                <Input type="number" name="deliveryTime" value={input.deliveryTime} onChange={changeEventHandler} placeholder="Enter your delivery time" />
                {errors&& <span className='text-xs text-red-600 font-medium'>{errors.deliveryTime}</span>}
              </div>
              <div>
                <Label>Cuisines</Label>
                <Input type="text" name="cuisines" value={input.cuisines} onChange={(event)=>setInput({...input, cuisines:event.target.value.split(", ")})} placeholder="e.g., Chinese, Italian" />
                {errors&& <span className='text-xs text-red-600 font-medium'>{errors.cuisines}</span>}
              </div>
              <div>
                <Label>Upload Restaurant Image</Label>
                <Input type="file" name="imageFile  " onChange={(event)=>setInput({...input, imageFile:event.target.files?.[0] || undefined})} accept="image/*" />
                {errors&& <span className='text-xs text-red-600 font-medium'>{errors.imageFile?.name}</span>}
              </div>
            </div>
            <div className='mb-5 mt-7 md:text-center'>
              {
                loading?(<Button disabled className = "bg-orange hover:bg-hoverOrange"><Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  Loading...</Button>):
                (<Button className = "bg-orange hover:bg-hoverOrange">{
                  restaurant ? "Update your restaurant":"Add your restaurant"
                }</Button>)
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Restaurant