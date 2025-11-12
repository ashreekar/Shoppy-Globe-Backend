import { Router } from "express";
import { verifyJwt } from "../middleware/verifyJWT.js"
import { checkOut, getOrders } from "../controller/checkout.controller.js";

const router = Router();

// Checkout route have 2 routes
// to get all the orders of a user
// to place order from his cart
router.route('/')
.get(verifyJwt, getOrders)
.post(verifyJwt, checkOut);

export default router;