import { Product } from '../models/product.model.js';
import { Vendor } from '../models/vendor.model.js';
import { APIerror } from '../utils/APIError.js';
import { APIresponse } from '../utils/APIResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

const addProduct = asyncHandler(async (req, res) => {
    const { title, price, description, category, discountPercentage = "0", brand, warrantyInformation = "NA", shippingInformation = "NA", availabilityStatus, tags = null, minimumOrderQuantity = 1, sku = "NA", weight = null, stock = null } = req.body;

    if (!title || !price || !description || !category || !brand || !availabilityStatus) {
        throw new APIerror(400, "title, price, description,category,brand these fields must be filled");
    }

    const vendor = req.vendor;

    const thumbnail = req.files?.thumbnail[0]?.filename;
    const imagesArray = req.files?.images || [];

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
        thumbnail,
        vendor
    });

    await Vendor.findByIdAndUpdate(vendor._id, {
        $push: { products: product._id }
    })

    return res.status(201).json(new APIresponse(201, "New product added", product));
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate("reviews");;

    if (!products) {
        return res.send(200).json(new APIresponse(200, "No products found", ""));
    }

    res.status(200).json(new APIresponse(200, "Sending results for products", products));
})

const getProductById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const product = await Product.findById(id).populate("reviews");

    if (!product) {
        throw new APIerror(404, "Product with id not found");
    }

    res.status(200).json(new APIresponse(200, "Sending results for product", product));
})

const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const vendor = req.vendor;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new APIerror(404, "Product with id not found");
    }

    const vendorToBeUpdated = await Vendor.findById(vendor._id);
    const filteredProducts = vendorToBeUpdated.products.filter(product => product === id);

    await Vendor.findByIdAndUpdate(vendor._id,
        {
            $set: { products: filteredProducts }
        }
    )

    res.status(200).json(new APIresponse(200, "Product deleted sucessfully", product));
})

const updateProductDetails = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const toUpdateFields = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new APIerror(404, "Product not exists");
    }

    const fields = Object.keys(toUpdateFields);
    if (fields.length === 0) {
        throw new APIerror(404, "At least pne field must be filled");
    }

    fields.map((field) => {
        product[field] = req.body[field];
    })
    product.save({ validateBeforeSave: false });
})

export { addProduct, getAllProducts, getProductById, deleteProduct, updateProductDetails };