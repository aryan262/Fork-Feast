import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMenuStore } from '@/store/useMenuStore';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function EditMenu({selectedMenu, editOpen, setEditOpen}) {
  const [input, setInput] = useState({
    name:"",
    description:"",
    price:0,
    image: undefined
  })
  const [error, setError] = useState({});
  const {loading, editMenu} = useMenuStore();
  const changeEventHandler=((event)=>{
    const {name, value, type} = event.target;
    setInput({...input, [name]:type==='number'?Number(value):value})
  })  

  const submitHandler = async(event)=>{
    event.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if(input.imageFile){
          formData.append("image", input.image);
      }
      await editMenu(selectedMenu._id, formData)
    } catch (error) {
        console.log(error.message);
    }
      
  }

  useEffect(()=>{
    setInput({
      name:selectedMenu?.name || "",
      description:selectedMenu?.description || "",
      price:selectedMenu?.price || 0,
      image: undefined
    })
  }, [selectedMenu])
  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Update your menu to keep your offerings fresh and exciting
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
  )
}

export default EditMenu