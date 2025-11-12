import { Vendor } from "../models/vendor.model.js";
import { APIerror } from "../utils/APIError.js";

// This verifyVendor middleware checks where update is by vendor or not
export const verifyVendor = async (req, res, next) => {
    const user = req.user;

    // checks for vendor in vendor schema
    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
        throw new APIerror(400, "Invalid acceas to add or update products");
    }

    // adds a vendor object to req body
    req.vendor = vendor;
    next();
}