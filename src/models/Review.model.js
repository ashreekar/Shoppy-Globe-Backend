import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
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