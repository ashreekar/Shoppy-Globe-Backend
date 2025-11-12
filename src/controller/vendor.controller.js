import { Vendor } from "../models/vendor.model.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIresponse } from '../utils/APIResponse.js'
import { APIerror } from "../utils/APIError.js";

// genrates both acceas and refresh token through schema methods
const generateAcceasTokenAndRefreshToken = async (id) => {
    try {
        const user = await Vendor.findById(id);

        // genrating using schema methods
        const acceasToken = await user.generateAcceasToken();
        const refreshToken = await user.generateRefreshToken();

        // updatign the refresh token in db
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { acceasToken, refreshToken };
    } catch (error) {
        throw new APIerror(500, "Something went wrong while generating acceas token and refresh token", error);
    }
}

// lgoic to register a vendor
const registerVendor = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    // creating the vendor
    const vendor = await Vendor.create(
        {
            fullName,
            username,
            email,
            password
        }
    )

    // NOTE: initially no products or orders will be there
    return res.status(201).json(
        new APIresponse(201, "User registered sucessfully", vendor)
    );
})

const loginVendor = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    // finding user by email or username
    const vendor = await Vendor.findOne({ $or: [{ email }, { username }] });

    if (!vendor) {
        throw new APIerror(404, "User not found");
    }

    // checking valid passowrd using schema methos
    const isValidPassword = await vendor.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new APIerror(401, "Incorrect password");
    }

    // return accestoken and refreshtoken
    const { acceasToken, refreshToken } = await generateAcceasTokenAndRefreshToken(vendor._id);

    // sending the user in return
    const loggeduser = await Vendor.findById(vendor._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    // settign up cookies and sending response
    res.status(200)
        .cookie("sgAcceasToken", acceasToken, options)
        .cookie("sgRefreshToken", refreshToken, options)
        .json(new APIresponse(200,
            "Login Sucessfull",
            {
                vendor: loggeduser,
                acceasToken,
                refreshToken
            }
        ))
})

// logging out a vendor
const logoutVendor = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new APIerror(404, "Invalid acceas from user");
    }

    // claering the refresh token
    await Vendor.findByIdAndUpdate(
        user._id,
        { $set: { refreshToken: "" } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    // clearig the cookies
    res.status(200)
    .clearCookie("sgAcceastoken")
    .clearCookie("sgRefreshtoken")
    .json(new APIresponse(200, "logged out sucessfully", null));
})

export { registerVendor, loginVendor, logoutVendor };