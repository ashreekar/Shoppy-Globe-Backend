import mongoose from "mongoose";

// model for cart Items only storing product id and quantity
const cartSchema = new mongoose.Schema(
    {
        // productId matches product from Product schema
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        // addedBy matches user from User schema
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Cart = mongoose.model("Cart", cartSchema);