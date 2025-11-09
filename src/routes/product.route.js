import { Router } from "express";
import { addProduct, getAllProducts, getProductById } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJwt } from "../middleware/verifyJWT.js";

const router = Router();

router
    .route('/')
    .get(verifyJwt, getAllProducts)
    .post(verifyJwt, upload.fields([{
        name: "images",
        maxCount: 4
    },
    {
        name: "thumbnail",
        maxCount: 1
    }]), addProduct)

router
    .route('/:id')
    .get(verifyJwt, getProductById)
    .put((req, res) => {
        const id = req.params.id;
        res.send(`Products route it is updated : ${id}`);
    })
    .delete((req, res) => {
        const id = req.params.id;
        res.send(`Products route it is deleted : ${id}`);
    })

export default router;