import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true
        },
        // stroign deatils of owner who is from users collection
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        // stroign deatils of product which is from products collection
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model("Review", reviewSchema);