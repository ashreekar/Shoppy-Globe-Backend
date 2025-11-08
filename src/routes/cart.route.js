import { Router } from "express";

const router = Router();

router
.route('/')
.post((req,res)=>{
    res.send("product added in cart")
})
.put((req,res)=>{
    res.send("Quantity updated in cart")
})
.delete((req,res)=>{
    res.send("product delted from cart")
})

export default router;