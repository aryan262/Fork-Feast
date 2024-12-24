import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createCheckOutSession, getOrders, stripeWebhook } from '../controllers/order.controller.js';
const router = express.Router();
router.route("/").get(isAuthenticated, getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckOutSession);
router.route("/webhook").post(express.raw({type: 'application/json'}), stripeWebhook)
export default router