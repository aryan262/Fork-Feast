import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import React, { useState } from 'react'
import Image from '@/assets/hero_pizza.png'
import EditMenu from './EditMenu';
import { menuSchema } from '@/schema/menuSchema';
import { useMenuStore } from '@/store/useMenuStore';
import { useRestaurantStore } from '@/store/useRestaurantStore';


function AddMenu() {
    const [input, setInput] = useState({
        name:"",
        description:"",
        price:0,
        image: undefined
    })
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState()
    const [error, setError] = useState({});
    const {loading, createMenu} = useMenuStore()
    const {restaurant} = useRestaurantStore();
    // const loading = false;

    const changeEventHandler=((event)=>{
        const {name, value, type} = event.target;
        setInput({...input, [name]:type==='number'?Number(value):value})
    })
    const submitHandler =async(event)=>{
        event.preventDefault();
        // console.log(input);
        const result = menuSchema.safeParse(input);
        if(!result.success){
            const fieldErrors = result.error.formErrors.fieldErrors;
            setError(fieldErrors)
            return;
        }
        // console.log(input);
        try {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("description", input.description);
            formData.append("price", input.price.toString());
            if(input.image){
                formData.append("image", input.image);
            }
            await createMenu(formData)
        } catch (error) {
            console.log(error.message);
        }
        
    }

  return (
    <div className='max-w-6xl mx-auto my-10'>
        <div className="flex justify-between">
            <h1 className='font-bold md:font-extrabold text-lg md:text-2xl'>Available Menus</h1>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-orange hover:bg-hoverOrange" >
                        <Plus className='mr-2'/>
                        Add Menus
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>A New Menu</DialogTitle>
                        <DialogDescription>
                            Create a menu that will make your restaurant stand out
                        </DialogDescription>
                    </DialogHeader>
                    <form className='space-y-4' onSubmit={submitHandler}>
                        <div className='space-y-2'>
                            <Label>Name</Label>
                            <Input type="text" name="name" value={input.name} onChange={changeEventHandler} placeholder="Enter menu name" />
                            {error&& <span className='text-xs text-red-600 font-medium'>{error.name}</span>}
                        </div>
                        <div className='space-y-2'>
                            <Label>Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler}  placeholder="Enter menu description" />
                            {error&& <span className='text-xs text-red-600 font-medium'>{error.description}</span>}
                        </div>
                        <div className='space-y-2'>
                            <Label>Price (in rupees)</Label>
                            <Input type="number" name="price" placeholder="Enter menu price" value={input.price} onChange={changeEventHandler}/>
                            {error&& <span className='text-xs text-red-600 font-medium'>{error.price}</span>}
                        </div>
                        <div className='space-y-2'>
                            <Label>Upload Menu Image</Label>
                            <Input type="file" name="image" onChange={(event)=>setInput({...input, image:event.target.files?.[0]||undefined})} />
                            {error&& <span className='text-xs text-red-600 font-medium'>{error.image?.name}</span>}
                        </div>
                        <DialogFooter className="mt-5">
                            {
                                loading ?(<Button disabled className="bg-orange hover:bg-hoverOrange w-full">
                                    <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
                                    Submitting...
                                </Button>):
                                (<Button className="bg-orange hover:bg-hoverOrange w-full">Submit</Button>)
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        {
            restaurant?.menus.map((menu, idx)=>(
                <div key={idx} className='mt-6 space-y-4'>
                    <div className='flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border'>
                        <img src={menu.image} alt='' className='md:h-24 md:w-24 h-16 w-full object-cover rounded-lg'/>
                        <div className='flex-1'>
                            <h1 className='text-lg font-semibold text-gray-800'>{menu.name}</h1>
                            <p className='text-sm text-gray-600 mt-1'>{menu.description}</p>
                            <h2 className='text-md font-semibold mt-2'>Price: <span className='text-[#D19254]'>{menu.price}</span></h2>
                        </div>
                        <Button onClick={()=>{
                            setSelectedMenu(menu);
                            setEditOpen(true);
                        }} size={'sm'} className="mt-2 bg-orange hover:bg-hoverOrange">Edit</Button>
                    </div>
                </div>
            ))
        }
        <EditMenu selectedMenu={selectedMenu} editOpen={editOpen} setEditOpen={setEditOpen}/>
    </div>
  )
}

export default AddMenu