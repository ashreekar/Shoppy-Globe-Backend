import { Router } from "express";
import { addToCart, deleteCart, getWholeCartForUser, updateTheCart } from "../controller/cart.controller.js";
import { verifyJwt } from "../middleware/verifyJWT.js";

const router = Router();

router
    .route('/')
    .get(verifyJwt, getWholeCartForUser)
    .post(verifyJwt, addToCart)
    .put(verifyJwt, updateTheCart)
    .delete(verifyJwt, deleteCart)

export default router;