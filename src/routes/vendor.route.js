import { Router } from "express";
import { verifyJwt } from "../middleware/verifyJWT.js";
import { loginVendor, registerVendor } from "../controller/vendor.controller.js";
import { logoutUser } from "../controller/user.controller.js";
import { verifyLoginUserFields, verifyRegisterUserFields, verifyVendorExists } from "../middleware/verifyUsercontrols.js"
import { verifyVendor } from "../middleware/verifyVendor.js";
import { getOrdersForVendor } from "../controller/checkout.controller.js";

const router = Router();

// vendor route have 4 features register, vendor login, vendor logout
router.route('/orders').get(verifyJwt, verifyVendor, getOrdersForVendor);
router.route('/register').post(verifyRegisterUserFields, verifyVendorExists, registerVendor)
router.route('/login').post(verifyLoginUserFields, loginVendor)
router.route('/logout').post(verifyJwt, logoutUser)

export default router;