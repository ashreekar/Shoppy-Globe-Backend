import { Router } from "express";
import { verifyJwt } from "../middleware/verifyJWT.js"
import { checkOut, getOrders } from "../controller/checkout.controller.js";

const router = Router();

router.route('/').get(verifyJwt, getOrders).post(verifyJwt, checkOut);

export default router;