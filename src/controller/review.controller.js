import { Product } from "../models/product.model.js";
import { Review } from "../models/Review.model.js";
import { APIerror } from "../utils/APIError.js";
import { APIresponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const addAreview = asyncHandler(async (req, res) => {
    const user = req.user;
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
        throw new APIerror(404, "Product not found");
    }

    const { body } = req.body;

    if (!body) {
        throw new APIerror(400, "No review body found");
    }

    const review = await Review.create({
        body,
        owner: user._id,
        product: id
    })

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