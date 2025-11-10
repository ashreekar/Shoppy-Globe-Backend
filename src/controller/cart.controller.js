import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { APIerror } from '../utils/APIError.js';
import { APIresponse } from '../utils/APIResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId) {
        throw new APIerror(404, "Product not found");
    }

    if (quantity <= 0) {
        throw new APIerror(400, "Quantity must be greater than zero");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new APIerror(404, "Product not found");
    }

    const cart = await Cart.create({
        productId,
        quantity: quantity,
        addedBy: req.user._id
    })

    res.status(201).json(new APIresponse(201, "Product added to cart sucessfully"), cart)
})

const addToCartByOne = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId) {
        throw new APIerror(404, "Product not found");
    }

    if (quantity <= 0) {
        throw new APIerror(400, "Quantity must be greater than zero");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new APIerror(404, "Product not found");
    }

    const cart = await Cart.findByIdAndUpdate(
        productId,
        {
            $set: {
                quantity: quantity
            }
        },
        {
            new: true
        }
    )

    res.status(201).json(new APIresponse(201, "Product updated from cart sucessfully"), cart);
})

const deleteCart=asyncHandler(async(req,res)=>{
    console.log("De,eted")
})

export { addToCart, addToCartByOne };