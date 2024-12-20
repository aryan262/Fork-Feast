import {z} from "zod"
export const menuSchema = z.object({
    name:z.string().nonempty({message:"Name is required"}),
    description:z.string().nonempty({message:"Description is required"}),
    price:z.number().min(0, {message:"Price cannot be negative"}),
    image:z.instanceof(File).optional().refine((file)=>file?.size!={message:"Restaurant image is required"}),
})