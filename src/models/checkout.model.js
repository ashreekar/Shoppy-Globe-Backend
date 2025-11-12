import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
    {
        adress: {
            type: String,
            required: true
        },
        // productId matches User from User schema
        orderedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // productId matches Vendor from Vendor schema
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true
        },
        // This array of ites makes a checkout items for a vendor
        items: [
            {
                // productId matches product from Product schema
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending"
        }
    },
    { timestamps: true }
);

export const Checkout = mongoose.model("Checkout", checkoutSchema);