import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createCheckOutSession, getOrders } from '../controllers/order.controller.js';
const router = express.Router();
router.route("/").get(isAuthenticated, getOrders);
router.route("/checkOut/createCheckoutSession").post(isAuthenticated, createCheckOutSession);
// router.route("/webhook").post()
export default router