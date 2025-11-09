import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { verifyLoginUserFields, verifyRegisterUserFields, verifyUserExists } from "../middleware/verifyUsercontrols.js"
import { verifyJwt } from "../middleware/verifyJWT.js";

const router = Router();

router.route('/register').post(verifyRegisterUserFields, verifyUserExists, registerUser)

router.route('/login').post(verifyLoginUserFields, loginUser)

router.route('/logout').post(verifyJwt, logoutUser);

export default router;