import { Checkout } from "../models/checkout.model.js";
import { Vendor } from "../models/vendor.model.js";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { APIerror } from "../utils/APIError.js";
import { APIresponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";

const checkOut = asyncHandler(async (req, res) => {
    const userid = req.user._id;
    const { adress } = req.body;

    const cart = await Cart.find({ addedBy: userid }).populate("productId");

    if (!cart.length) {
        return res.status(400).json(new APIresponse(400, "Nothing in cart to checkout", null));
    }

    // gives a vendors map that present in a cart
    const vendorsMap = {};

    for (let item of cart) {
        const vendorId = item.productId.vendor.toString();

        if (vendorsMap[vendorId]) {
            vendorsMap[vendorId].push(item);
        } else {
            vendorsMap[vendorId] = [];
        }
    }

    const checkouts = [];
    for (let [vendorId, item] of Object.entries(vendorsMap)) {

        // formulating the checkout object
        const total = item.reduce(
            (acc, val) => acc + Number(val.productId.price) * val.quantity,
            0
        )

        const singleVendorCheckout = await Checkout.create(
            {
                adress,
                orderedBy: userid,
                vendor: vendorId,
                items: item.map((val) => {
                    return {
                        product: val.product._id,
                        quantity: val.quantity
                    }
                }),
                totalAmount: total
            }
        )

        await Vendor.findByIdAndUpdate(vendorId,
            {
                $push: {
                    orders: singleVendorCheckout._id
                }
            }
        )
        await User.findByIdAndUpdate(vendorId,
            {
                $push: {
                    orders: singleVendorCheckout._id
                }
            }
        )

        checkouts.push(singleVendorCheckout);
    }

    await Cart.deleteMany({ addedBy: userid });

    res.status(201).json(new APIresponse(201, "Checkout sucessfull", checkouts))
})

const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const checkouts = await Checkout.find({ orderedBy: userId }).populate("product");

    res.status(200).json(new APIresponse(200, "All orders of user", checkouts));
})

export { checkOut, getOrders };