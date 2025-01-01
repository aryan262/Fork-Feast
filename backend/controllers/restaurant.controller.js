import { Restaurant } from "../models/restaurant.model.js";
// import {Multer} from 'multer'
import uploadImageOnCloudinary from "../utils/imageUpload.js";
import { Order } from "../models/order.model.js";
export const createRestaurant = async(req, res)=>{
    try {
        const {restaurantName, city, country, deliveryTime, cuisines} = req.body;
        const file = req.file;
        const resturant = await Restaurant.findOne({user:req.id})
        if(resturant){
            return res.status(400).json({success:false, message:"Restaurant already exists from this user"})
        }
        if(!file){
            return res.status(400).json({success:false, message:"Image is Required"})
        }
        const imageUrl = await uploadImageOnCloudinary(file)
        await Restaurant.create({
            user:req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines:JSON.parse(cuisines),
            imageUrl,
        })
        return res.status(201).json({success:true, message:"Restaurant Added"})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message})
    }
}
export const getRestaurant = async(req, res)=>{
    try {
        const restaurant = await Restaurant.findOne({user:req.id}).populate('menus');
        if(!restaurant){
            return res.status(404).json({success:false, restaurant:[], message:"No Restaurant found"})
        }
        return res.status(200).json({success:true, restaurant})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export const updateRestaurant = async(req, res)=>{
    try {
        const {restaurantName, city, country, deliveryTime, cuisines} = req.body;
        const restaurant = await Restaurant.findOne({user:req.id});
        if(!restaurant){
            return res.status(404).json({success:false, message:"No Restaurant found"})
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines)
        if(file){
            const imageUrl = await uploadImageOnCloudinary(file);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        return res.status(200).json({success:true, message:"Restaurant Updated", restaurant})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}
export const getRestaurantOrder = async(req, res)=>{
    try {
        const restaurant = await Restaurant.find({user:req.id});
        if(!restaurant){
            return res.status(404).json({success:false, message:"No Restaurant found"})
        }
        const orders = await Order.find({restaurant:restaurant._id}).populate('restaurant').populate('user'); 
        return res.status(200).json({success:true, orders})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export const updateOrderStatus = async(req, res)=>{
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({success:false, message:"Order Not Found"})
        }
        order.status = status;
        await order.save();
        return res.status(200).json({success:true,status:order.status, message:"Order Status Updated"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export const searchRestaurant = async(req, res)=>{
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = (req.query.selectedCuisines || "").split(",").filter(cuisine => cuisine);
        const query = {};
        if(searchText){
            query.$or = [
                {restaurantName:{$regex:searchText, $options:'i'}},
                {city:{$regex:searchText, $options:'i'}},
                {country:{$regex:searchText, $options:'i'}}
            ]
        }

        if(searchQuery){
            query.$or = [
                {restaurantName:{$regex:searchQuery, $options:'i'}},
                {cuisines:{$regex:searchQuery, $options:'i'}}
            ]
        }
        // console.log(query);
        if(selectedCuisines.length>0){
            query.cuisines = {$in:selectedCuisines}
        }

        const restaurants = await Restaurant.find(query);
        return res.status(200).json({success:true, data:restaurants})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export const getSingleRestaurant = async(req, res)=>{
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path:'menus',
            options:{createdAt:-1}
        });
        if(!restaurant){
            return res.status(404).json({success:false, message:"Restaurant Not Found"})
        }
        return res.status(200).json({success:true, restaurant})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}