import { Product } from "../models/product.model.js";
import { Review } from "../models/Review.model.js";
import { APIerror } from "../utils/APIError.js";
import { APIresponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// users can add revies and vendors can add instructions
const addAreview = asyncHandler(async (req, res) => {
    const user = req.user;
    const id = req.params.id;

    // this is a dynamic post route
    const product = await Product.findById(id);

    if (!product) {
        throw new APIerror(404, "Product not found");
    }

    // review body is sent from user
    const { body } = req.body;

    if (!body) {
        throw new APIerror(400, "No review body found");
    }

    // creating a review dicument with owner and product mapping
    const review = await Review.create({
        body,
        owner: user._id,
        product: id
    })

    // updating the product schema
    await Product.findByIdAndUpdate(
        id,
        {
            $push: { reviews: review }
        }
    )

    res
        .status(201)
        .json(
            new APIresponse(201, "Posted a review sucessfully", review)
        );
})

export { addAreview };