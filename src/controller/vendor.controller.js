import { Vendor } from "../models/vendor.model.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIresponse } from '../utils/APIResponse.js'
import { APIerror } from "../utils/APIError.js";

const generateAcceasTokenAndRefreshToken = async (id) => {
    try {
        const user = await Vendor.findById(id);

        const acceasToken = await user.generateAcceasToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { acceasToken, refreshToken };
    } catch (error) {
        throw new APIerror(500, "Something went wrong while generating acceas token and refresh token", error);
    }
}

const registerVendor = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    const vendor = await Vendor.create(
        {
            fullName,
            username,
            email,
            password
        }
    )

    return res.status(201).json(
        new APIresponse(201, "User registered sucessfully", vendor)
    );
})

const loginVendor = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    const vendor = await Vendor.findOne({ $or: [{ email }, { username }] });

    if (!vendor) {
        throw new APIerror(404, "User not found");
    }

    const isValidPassword = await vendor.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new APIerror(401, "Incorrect password");
    }

    const { acceasToken, refreshToken } = await generateAcceasTokenAndRefreshToken(vendor._id);

    const loggeduser = await Vendor.findById(vendor._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

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

const logoutVendor = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new APIerror(404, "Invalid acceas from user");
    }

    await Vendor.findByIdAndUpdate(
        user._id,
        { $set: { refreshToken: "" } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).clearCookie("sgacceastoken").clearCookie("sgrefreshtoken").json(new APIresponse(200, "logged out sucessfully", null));
})

export { registerVendor, loginVendor, logoutVendor };