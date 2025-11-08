import { Router } from "express";

const router = Router();

router.route('/register').post((req,res)=>{
    res.send("Registered user")
})

router.route('/login').post((req,res)=>{
    res.send("user logged in")
})

export default router;