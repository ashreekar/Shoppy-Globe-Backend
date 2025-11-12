import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProductDetails } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJwt } from "../middleware/verifyJWT.js";
import { addAreview } from "../controller/review.controller.js";
import { verifyVendor } from "../middleware/verifyVendor.js";

const router = Router();

// Product route is mostly not protected 
// excpt adding product and updating it
router
    .route('/')
    .get(getAllProducts)
    // multer helps us to upload the images and files to server
    .post(verifyJwt, verifyVendor, upload.fields([{
        name: "images",
        maxCount: 4
    },
    {
        name: "thumbnail",
        maxCount: 1
    }]), addProduct)

// user can add a review on every project but it is protected
router
    .route('/:id')
    .post(verifyJwt, addAreview)
    .get(getProductById)
    .put(verifyJwt, verifyVendor, updateProductDetails)
    .delete(verifyJwt, verifyVendor, deleteProduct)

export default router;