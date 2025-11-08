import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: String,
            required: true,
        },
        images: [{
            type: String,
        }],
        thumbnail: {
            type: String,
        },
        reviews: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Review"
            }
        ],
        rating: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        discountPercentage: {
            type: String,
            default: "0"
        },
        brand: {
            type: String,
            required: true,
        },
        warrantyInformation: {
            type: String,
        },
        shippingInformation: {
            type: String,
        },
        availabilityStatus: {
            type: Boolean,
            default: true
        },
        tags: [
            {
                type: String,
            }
        ],
        minimumOrderQuantity: {
            type: Number,
            default: 1
        },
        sku: {
            type: String,
        },
        weight: {
            type: Number,
        },
        stock: {
            type: Number,
        }
    },
    { timestamps: true }
)

export const Product=mongoose.model("Product",productSchema);