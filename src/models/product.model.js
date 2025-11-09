import mongoose from "mongoose";

// model for products
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
        // storing multiple images path for serving statically of type string
        images: [{
            type: String,
        }],
        thumbnail: {
            type: String,
        },
        // review model is separate of and referign a each review
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
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
            default: true,
            required:true
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