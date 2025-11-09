import { Product } from '../models/product.model.js';
import { APIerror } from '../utils/APIError.js';
import { APIresponse } from '../utils/APIResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

const addProduct = asyncHandler(async (req, res) => {
    const { title, price, description, category, discountPercentage = "0", brand, warrantyInformation = "NA", shippingInformation = "NA", availabilityStatus, tags = null, minimumOrderQuantity = 1, sku = "NA", weight = null, stock = null } = req.body;

    if (!title || !price || !description || !category || !brand || !availabilityStatus) {
        throw new APIerror(400, "title, price, description,category,brand these fields must be filled");
    }

    const thumbnail = req.files?.thumbnail[0].filename;
    const imagesArray = req.files?.images;

    const images = imagesArray.map(image => image.filename);

    const product = await Product.create({
        title,
        price,
        description,
        discountPercentage,
        availabilityStatus,
        category,
        brand,
        warrantyInformation,
        shippingInformation,
        tags,
        minimumOrderQuantity,
        sku,
        weight,
        stock,
        images,
        thumbnail
    });

    return res.status(201).json(new APIresponse(201, "New product added", product));
})

export { addProduct };