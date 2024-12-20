import {z} from "zod"
export const restaurantFormSchema = z.object({
    restaurantName:z.string().nonempty({message:"Restaurant name is required"}),
    city:z.string().nonempty({message:"City is required"}),
    country:z.string().nonempty({message:"Country is required"}),
    deliveryTime:z.number().min(0, {message:"Delivery Time can't be negative"}),
    cuisines:z.array(z.string()),
    imageFile:z.instanceof(File).optional().refine((file)=>file?.size!={message:"Restaurant image is required"}),
})