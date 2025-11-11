import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProductDetails } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJwt } from "../middleware/verifyJWT.js";
import { addAreview } from "../controller/review.controller.js";
import { verifyVendor } from "../middleware/verifyVendor.js";

const router = Router();

router
    .route('/')
    .get(getAllProducts)
    .post(verifyJwt, verifyVendor, upload.fields([{
        name: "images",
        maxCount: 4
    },
    {
        name: "thumbnail",
        maxCount: 1
    }]), addProduct)

router
    .route('/:id')
    .post(verifyJwt, addAreview)
    .get(getProductById)
    .put(verifyJwt, verifyVendor, updateProductDetails)
    .delete(verifyJwt, deleteProduct)

export default router;