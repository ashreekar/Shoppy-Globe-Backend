import { Router } from "express";
import { loginUser, registerUser } from "../controller/user.controller.js";
import { verifyLoginUserFields, verifyRegisterUserFields, verifyUserExists } from "../middleware/verifyUsercontrols.js"

const router = Router();

router.route('/register').post(verifyRegisterUserFields, verifyUserExists, registerUser)

router.route('/login').post(verifyLoginUserFields, loginUser)

export default router;