import { Menu } from "../models/menu.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import uploadImageOnCloudinary from "../utils/imageUpload.js";

export const addMenu = async(req, res)=>{
    try {
        const {name, description, price} = req.body;
        const file = req.file;
        if(!file){
            return res.status(400).json({success:false, message:"Image is Required"})
        }
        const imageUrl = await uploadImageOnCloudinary(file)
        const menu = await Menu.create({
            name, description, price, image:imageUrl
        })
        const restaurant = await Restaurant.findOne({user:req.id});
        if(restaurant){
            (restaurant.menus).push(menu._id);
            await restaurant.save();
        }
        return res.status(201).json({success:true, message:"Menu Added Successfully", menu})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})
    }
}

export const editMenu = async(req, res)=>{
    try {
        const {id} = req.params;
        const {name, description, price} = req.body;
        const file = req.file;
        const menu = await Menu.findById(id);
        if(!menu){
            return res.status(404).json({success:false, message:"Menu not Found!"})
        }
        if(name)menu.name = name;
        if(description)menu.description = description;
        if(price)menu.price = price;

        if(file){
            const imageUrl = await uploadImageOnCloudinary(file);
            menu.image = imageUrl;
        }
        await menu.save();
        return res.status(201).json({success:true, message:"Menu Updated Successfully", menu})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})
    }
}