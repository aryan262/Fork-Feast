import { Order } from "../models/order.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getOrders = async(req, res)=>{
    try {
        const orders = await Order.find({user:req.id}).populate('user').populate('restaurant');
        return res.status(200).json({success:true, orders})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:error.message})
    }
}

export const createCheckOutSession = async(req, res)=>{
    try {
        const checkOutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkOutSessionRequest.restaurantId).populate('menus');
        if(!restaurant){
            return res.status(400).json({success:false, message:"Restaurant Not Found"})
        }
        const order = new Order({
            restaurant:restaurant._id,
            user:req.id,
            deliveryDetails:checkOutSessionRequest.deliveryDetails,
            cartItems:checkOutSessionRequest.cartItems,
            status:"pending"
        })

        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkOutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            shipping_address_collection:{
                allowed_countries:['GB', 'US', 'CA', 'IN']
            },
            line_items:lineItems,
            mode:'payment',
            success_url:`${process.env.FRONTEND_URL}/order/status`,
            cancel_url:`${process.env.FRONTEND_URL}/cart`,
            metadata:{
                orderId:order._id.toString(),
                images:JSON.stringify(menuItems.map((item)=>item.image))
            }
        }) 
        if(!session.url){
            return res.status(400).json({success:false, message:"Error while creating payment session"})
        }
        await order.save();
        return res.status(200).json({session})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})
    }
}
const stripeWebhook = async(req, res)=>{
    let event;

    try {
        const signature = req.headers["stripe-signature"];

        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
 
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";

            await order.save();
        } catch (error) {
            console.error('Error handling event:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    res.status(200).send();
}


export const createLineItems = (checkOutSessionRequest, menuItems)=>{
    const lineItems =  checkOutSessionRequest.cartItems.map((cartItem)=>{
        const menuItem = menuItems.find((item)=>item._id.toString()===cartItem.menuId);
        if(!menuItem)throw new Error(`Menu item id not found`);
        return {
            price_data:{
                currency:'inr',
                product_data:{
                    name:{
                        name:menuItem.name,
                        images:[menuItem.image]
                    },
                    unit_amount:menuItem.price*100
                },
                quantity:cartItem.quantity
            }
        }
    })
    return lineItems
}