import mongoose from "mongoose"
const restaurantSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    restaurantName:{
        type:String,
        requred:true
    },
    city:{
        type:String,
        requred:true
    },
    country:{
        type:String,
        requred:true
    },
    deliveryTime:{
        type:Number,
        requred:true
    },
    cuisines:[
        {
            type:String,
            required:true
        }
    ],
    menus:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Menu'
        }
    ],
    imageUrl:{
        type:String,
        required:true
    }
}, {timestamps:true})
export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
