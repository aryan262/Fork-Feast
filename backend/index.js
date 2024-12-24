import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
// import bodyParser from 'body-parser'
import cookieParser from "cookie-parser";
import cors from 'cors'
import userRoutes from './routes/user.routes.js'
import restaurantRoutes from './routes/restaurant.routes.js'
import menuRoutes from './routes/menu.routes.js'
import orderRoutes from './routes/order.routes.js'
dotenv.config();
const app = express();
const port = process.env.PORT || 3000

// app.use(bodyParser.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true, limit:'10mb'}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:"*", credentials:true}))

app.use("/api/user", userRoutes)
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/menu", menuRoutes)
app.use("/api/order", orderRoutes)
app.use("/", (req, res)=>{
    res.send("Hello from server");
})

connectDB();
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})