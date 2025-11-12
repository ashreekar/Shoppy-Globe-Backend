import { Checkout } from "../models/checkout.model.js";
import { Vendor } from "../models/vendor.model.js";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { APIerror } from "../utils/APIError.js";
import { APIresponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";

// checkout handler that supports multi vendor
const checkOut = asyncHandler(async (req, res) => {
    const userid = req.user._id;
    const { adress } = req.body;

    // takes adress from user and user body comes form jwt validation
    const cart = await Cart.find({ addedBy: userid }).populate("productId");

    if (!cart.length) {
        return res.status(400).json(new APIresponse(400, "Nothing in cart to checkout", null));
    }

    // gives a vendors map that present in a cart
    const vendorsMap = {};

    for (let item of cart) {
        // converting the vendor id to string it is storecd as ObjectId
        const vendorId = item.productId.vendor.toString();

        // mapping the vendors with product
        if (vendorsMap[vendorId]) {
            vendorsMap[vendorId].push(item);
        } else {
            // first product a vendor
            vendorsMap[vendorId] = [item];
        }
    }
    // Above logic looks like:
    // {
    //     vendor1:[item1,item2,item3],
    //     vendor2:[item4,item5]
    //     vendor3:[item6,item7]
    // }
    // NOTE: This is for single user

    const checkouts = []; // making diferent checkout object for different vendors
    // Object.entries(object)
    // gives an array like [key,value],[key,value]
    for (let [vendorId, item] of Object.entries(vendorsMap)) {

        // formulating the checkout object total cost for single vendor for multiple proucts
        // this looks like
        // [vendor1,[item1,item2,item3]]
        //   vendorId----item(array)
        const total = item.reduce(
            (acc, val) => acc + Number(val.productId.price) * val.quantity,
            0
        )

        // creating a checkout
        const singleVendorCheckout = await Checkout.create(
            {
                adress,
                orderedBy: userid,
                vendor: vendorId,
                // item is looped and values will be pushed they are 
                // separate products of a single vendor
                items: item.map((val) => {
                    return {
                        product: val.productId._id,
                        quantity: val.quantity
                    }
                }),
                totalAmount: total
            }
        )

        // updating in vendor schema 
        await Vendor.findByIdAndUpdate(vendorId,
            {
                $push: {
                    orders: singleVendorCheckout._id
                }
            }
        )
        // updating in user schema
        await User.findByIdAndUpdate(userid,
            {
                $push: {
                    orders: singleVendorCheckout._id
                }
            }
        )

        checkouts.push(singleVendorCheckout);
    }

    // deleting the cart of a user 
    await Cart.deleteMany({ addedBy: userid });

    res.status(201).json(new APIresponse(201, "Checkout sucessfull", checkouts))
})

// handler for getting order for user
const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // find checkouts that match a user
    const checkouts = await Checkout.find({ orderedBy: userId })
    // populating with product
        .populate({
            path: "items.product",   // this is the correct nested path
            model: "Product"
        })
        .populate({
            path: "vendor",          // poulating with vendor details
            model: "Vendor"
        }).select(-refreshToken, -password)

    res.status(200).json(new APIresponse(200, "All orders of user", checkouts));
})

// handlig for getting all orders for a vendor
const getOrdersForVendor = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // finding by userid beacuse jwt veryfies it
    const orders = await Checkout.find({ vendor: userId })
        .populate({
            path: "items.product",   // this is the correct nested path
            model: "Product"
        })
        .populate({
            path: "orderedBy",       // optional: include user details
            model: "User",
            select: "name email"
        });

    res.status(200).json(new APIresponse(200, "All orders for vendor", orders));
})

export { checkOut, getOrders, getOrdersForVendor };