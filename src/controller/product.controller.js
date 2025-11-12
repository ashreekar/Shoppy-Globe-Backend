import { Product } from '../models/product.model.js';
import { Vendor } from '../models/vendor.model.js';
import { APIerror } from '../utils/APIError.js';
import { APIresponse } from '../utils/APIResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

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
    const thumbnail = req.files?.thumbnail[0]?.filename;
    const imagesArray = req.files?.images || [];

    const images = imagesArray.map(image => image.filename);

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
        images,
        thumbnail,
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new APIerror(404, "Product with id not found");
    }

    // can't directly pop a product so finding and filtering the product
    const vendorToBeUpdated = await Vendor.findById(vendor._id);
    const filteredProducts = vendorToBeUpdated.products.filter(product => product === id);

    // and updating the vendor arary of products
    await Vendor.findByIdAndUpdate(vendor._id,
        {
            $set: { products: filteredProducts }
        }
    )

    res.status(200).json(new APIresponse(200, "Product deleted sucessfully", product));
})

// vendor can update product info also
const updateProductDetails = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const toUpdateFields = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new APIerror(404, "Product not exists");
    }

    // getting all the keys that needs to be updated
    const fields = Object.keys(toUpdateFields);
    if (fields.length === 0) {
        throw new APIerror(404, "At least pne field must be filled");
    }

    // updating product with given fields
    fields.map((field) => {
        product[field] = req.body[field];
    })
    product.save({ validateBeforeSave: false });
})

export { addProduct, getAllProducts, getProductById, deleteProduct, updateProductDetails };