import { Product } from '../models/product.model.js';
import { Vendor } from '../models/vendor.model.js';
import { APIerror } from '../utils/APIError.js';
import { APIresponse } from '../utils/APIResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary, deleteOnCloudinary } from '../utils/cloudinary.js';

// this request handler is to add products from a vendor only
const addProduct = asyncHandler(async (req, res) => {
    const { title, price, description, category, discountPercentage = "0", brand, warrantyInformation = "NA", shippingInformation = "NA", availabilityStatus, tags = null, minimumOrderQuantity = 1, sku = "NA", weight = null, stock = null } = req.body;

    // taking all the fields mentioned in schema but only few fileds are necessary
    // title,price,description,category,brand,avaialbilty status is must
    if (!title || !price || !description || !category || !brand || !availabilityStatus) {
        throw new APIerror(400, "title, price, description,category,brand these fields must be filled");
    }

    // req.vendor is coming through vendor middleware
    const vendor = req.vendor;

    // if sends images they are uploaded through multur
    // uploading multiple files so an array of files exists
    const thumbnailArray = req.files?.thumbnail;
    let thumbnail = null;
    if (thumbnailArray) {
        thumbnail = thumbnailArray[0]?.path;
    }
    const imagesArray = req.files?.images || [];

    const imagesPath = await Promise.all(
        imagesArray.map(async (image) => {
            const uploaded = await uploadOnCloudinary(image.path);
            return uploaded?.url; // adjust based on what uploadOnCloudinary returns
        })
    );

    let thumbnailPath = null;
    if (thumbnail) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnail);
        thumbnailPath = uploadedThumbnail?.url;
    }

    // ccretaing a product with all fields
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
        images: imagesPath,
        thumbnail: thumbnailPath,
        vendor
    });

    // upadting the vendor products field
    await Vendor.findByIdAndUpdate(vendor._id, {
        $push: { products: product._id }
    })

    return res.status(201).json(new APIresponse(201, "New product added", product));
})

// this request handler is to get all products from db
// not protected
const getAllProducts = asyncHandler(async (req, res) => {
    // ifnd froducts
    const products = await Product.find({});

    // if no product exists send 200
    if (!products) {
        return res.send(404).json(new APIresponse(404, "No products found", ""));
    }

    res.status(200).json(new APIresponse(200, "Sending results for products", products));
})

// request handler to get single product by id (dynamic)
const getProductById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    // populating reviews also so reviews of each product available
    const product = await Product.findById(id).populate("reviews");

    if (!product) {
        throw new APIerror(404, "Product with id not found");
    }

    res.status(200).json(new APIresponse(200, "Sending results for product", product));
})

// dleting product accesing only by a vendor
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const vendor = req.vendor;

    // Delete only if vendor owns it
    const product = await Product.findOneAndDelete({
        _id: id,
        vendor: vendor._id
    });

    if (!product) {
        throw new APIerror(404, "Product not found or not owned by this vendor");
    }

    // Remove product reference from vendor
    await Vendor.findByIdAndUpdate(vendor._id, {
        $pull: { products: id }
    });

    res.status(200).json(
        new APIresponse(200, "Product deleted successfully", product)
    );
});


// vendor can update product info also
const updateProductDetails = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const toUpdateFields = req.body;
    const vendor = req.vendor;

    const product = await Product.findOne({ _id: productId, vendor: vendor._id });

    if (!product) {
        throw new APIerror(404, "Product not found or not owned by this vendor");
    }

    const fields = Object.keys(toUpdateFields);
    if (fields.length === 0) {
        throw new APIerror(400, "At least one field must be provided");
    }

    fields.forEach((field) => {
        product[field] = toUpdateFields[field];
    });

    await product.save({ validateBeforeSave: false });

    res.status(200).json(
        new APIresponse(200, "Product updated successfully", product)
    );
});

export { addProduct, getAllProducts, getProductById, deleteProduct, updateProductDetails };