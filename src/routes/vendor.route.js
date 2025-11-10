import { Router } from "express";
import { verifyJwt } from "../middleware/verifyJWT.js";
import { loginVendor, registerVendor } from "../controller/vendor.controller.js";
import { logoutUser } from "../controller/user.controller.js";
import { verifyLoginUserFields, verifyRegisterUserFields, verifyVendorExists } from "../middleware/verifyUsercontrols.js"

const router = Router();

router.route('/register').post(verifyRegisterUserFields, verifyVendorExists, registerVendor)
router.route('/login').post(verifyLoginUserFields, loginVendor)
router.route('/logout').post(verifyJwt, logoutUser)

export default router;