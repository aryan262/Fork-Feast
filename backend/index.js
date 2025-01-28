import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import restaurantRoute from "./routes/restaurant.route.js";
import menuRoute from "./routes/menu.route.js";
import orderRoute from "./routes/order.route.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://forkfeast.vercel.app"
    ],
    credentials: true
}
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});