import { Router } from "express";
import { addToCart, deleteCart, getWholeCartForUser, updateTheCart } from "../controller/cart.controller.js";
import { verifyJwt } from "../middleware/verifyJWT.js";

const router = Router();
// this route gives all functionality of a cart

// In this a user can gethis whole cart at GET
// Add to cart at POST
// Update the cart at PUT
// Delete the cart at DELETE
router
    .route('/')
    .get(verifyJwt, getWholeCartForUser)
    .post(verifyJwt, addToCart)
    .put(verifyJwt, updateTheCart)
    .delete(verifyJwt, deleteCart)

export default router;