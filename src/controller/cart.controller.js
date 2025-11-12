import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { APIerror } from '../utils/APIError.js';
import { APIresponse } from '../utils/APIResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

// Adding to cart route handler
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    // only updates product and quantity in cart and is unique for user and product
    if (!productId) {
        throw new APIerror(404, "Product not found");
    }

    // checking wherether current user maps for user and productId in Cart  schema
    const cartExists = await Cart.findOne(
        {
            $and: [{ addedBy: req.user._id }, { productId }]
        }
    )

    // if cart exists we will request to update it instead add a new cart
    if (cartExists) {
        throw new APIerror(400, "Cart is already exists please hit update cart route");
    }

    // checking for quantity is greater than equal to zero
    if (quantity <= 0) {
        throw new APIerror(400, "Quantity must be greater than zero");
    }

    // checking in case product exists
    const product = await Product.findById(productId);

    if (!product) {
        throw new APIerror(404, "Product not found");
    }

    // creating a new cart
    const cart = await Cart.create({
        productId,
        quantity: quantity,
        addedBy: req.user._id
    })

    res.status(201).json(new APIresponse(201, "Product added to cart sucessfully"), cart)
})

// updating cart route handler
const updateTheCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    // checking for productid and qauntity values for the input
    if (!productId) {
        throw new APIerror(404, "Product not found");
    }

    if (quantity <= 0) {
        throw new APIerror(400, "Quantity must be greater than zero");
    }

    // checking for product exists in the Product schema
    const product = await Product.findById(productId);

    if (!product) {
        throw new APIerror(404, "Product not found");
    }

    // updating the cart and updating the quantity
    const cart = await Cart.findOneAndUpdate(
        {
            $and: [{ addedBy: req.user._id }, { productId }]
        },
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

// deleting the cart route handler
const deleteCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw new APIerror(404, "Product not found");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new APIerror(404, "Product not found");
    }

    // find by mapping the addedBy and productId and deleting it
    await Cart.findOneAndDelete(
        {
            $and: [{ addedBy: req.user._id }, { productId }]
        },
        {
            new: true
        }
    )

    res.status(203).json(new APIresponse(203, "Product deleted from cart"));
})

// this route handler handles the cart values for whole cart
const getWholeCartForUser = asyncHandler(async (req, res) => {
    const user = req.user;

    // find the cart by added by user and populate them with product details
    const cart = await Cart.find(
        {
            addedBy: user._id
        }
    ).populate("productId");

    // if cart not exists it throws error
    if (!cart) {
        throw new APIerror(404, "No items found in cart for a user");
    }

    res.status(200).json(new APIresponse(200, "Cart data sent sucesfullu", cart));
})

export { addToCart, updateTheCart, deleteCart, getWholeCartForUser };