import { Router } from "express";

const router = Router();

router.route('/').get((req,res)=>{
    res.send("Products route");
})

router.route('/:id').get((req,res)=>{
    const id=req.params.id;
    res.send(`Products route : ${id}`);
})

export default router;