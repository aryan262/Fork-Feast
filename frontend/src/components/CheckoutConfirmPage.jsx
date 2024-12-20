import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useUserStore } from '@/store/useUserStore'
import { useCartStore } from '@/store/useCartStore'
import { useRestaurantStore } from '@/store/useRestaurantStore'
import { useOrderStore } from '@/store/useOrderStore'
import { Loader2 } from 'lucide-react'

function CheckoutConfirmPage({open, setOpen}) {
    const {user} = useUserStore()
    const {cart} = useCartStore();
    const {createCheckoutSession, loading} = useOrderStore()
    const {restaurant} = useRestaurantStore()
    const [input, setInput]= useState({
        name:user?.fullName||"",
        email:user?.email||"",
        contact:user?.contact.toString()||"",
        address:user?.address||"",
        city:user?.city||"",
        country:user?.country||""
    })
    const changeEventHandler=(event)=>{
        const {name, value}=event.target;
        setInput({...input, [name]:value});
    }
    const checkOutHandler=async(event)=>{
        event.preventDefault();
        try {
            const checkoutData = {
                cartItems:cart.map((cartItem)=>({
                    menuId:cartItem._id,
                    name:cartItem.name,
                    image:cartItem.image,
                    price:cartItem.price.toString(),
                    quantity:cartItem.quantity.tostring(),
                })),
                deliveryDetails:input,
                restaurantId:restaurant?._id
            };
            await createCheckoutSession(checkoutData);
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent>
            <DialogTitle className="Font-bold">Review Your Order</DialogTitle>
            <DialogDescription className="text-xs">Double-Check your delivery details and ensure everything is correct. When you are ready, please hit the confirm button to finalize your order</DialogDescription>
            <form onSubmit={checkOutHandler} className='md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0'>
            <div>
                <Label >FullName</Label>
                <Input type="text" name="name" value={input.name} onChange={changeEventHandler} />
            </div>
            <div>
                <Label >Email</Label>
                <Input disabled type="email" name="email" value={input.email} onChange={changeEventHandler} />
            </div>
            <div>
                <Label >Contact</Label>
                <Input type="text" name="contact" value={input.contact} onChange={changeEventHandler} />
            </div>
            <div>
                <Label >Address</Label>
                <Input type="text" name="address" value={input.address} onChange={changeEventHandler} />
            </div>
            <div>
                <Label >City</Label>
                <Input type="text" name="city" value={input.city} onChange={changeEventHandler} />
            </div>
            <div>
                <Label >Country</Label>
                <Input type="text" name="country" value={input.country} onChange={changeEventHandler} />
            </div>
            <DialogFooter className="col-span-2 pt-5" >
                {
                    loading?(
                    <Button disabled className="bg-orange hover:bg-hoverOrange w-full">
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please Wait...
                    </Button>):
                    (<Button className="bg-orange hover:bg-hoverOrange w-full">Continue to Payment</Button>)
                }
            </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CheckoutConfirmPage