import { Vendor } from "../models/vendor.model";
import { APIerror } from "../utils/APIError";

export const verifyVendor = async (req, res, next) => {
    const user = req.user;

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
        throw new APIerror(400, "Invalid acceas to add products");
    }

    req.vendor = vendor;
    next();
}