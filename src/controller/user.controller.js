import { User } from "../models/user.model.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIresponse } from '../utils/APIResponse.js'
import { APIerror } from "../utils/APIError.js";

// genrating acceas and refreshtoken using schema methods
const generateAcceasTokenAndRefreshToken = async (id) => {
    try {
        const user = await User.findById(id);

        const acceasToken = await user.generateAcceasToken();
        const refreshToken = await user.generateRefreshToken();

        // upadting refrestoken in db
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { acceasToken, refreshToken };
    } catch (error) {
        throw new APIerror(500, "Something went wrong while generating acceas token and refresh token", error);
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    // creating a basic user profile
    const user = await User.create(
        {
            fullName,
            username,
            email,
            password
        }
    )

    return res.status(201).json(
        new APIresponse(201, "User registered sucessfully", user)
    );
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    // finding whether user exists by eamil or password
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
        throw new APIerror(404, "User not found");
    }

    // validating the password using bcrypt
    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new APIerror(401, "Incorrect password");
    }

    // generating acceas and refresh token
    const { acceasToken, refreshToken } = await generateAcceasTokenAndRefreshToken(user._id);

    // filtering our password and refresh token
    const loggeduser = await User.findById(user._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    // sending cookies through options
    res.status(200)
        .cookie("sgAcceasToken", acceasToken, options)
        .cookie("sgRefreshToken", refreshToken, options)
        .json(new APIresponse(200,
            "Login Sucessfull",
            {
                user: loggeduser,
                acceasToken,
                refreshToken
            }
        ))
})

//method to logut user
const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new APIerror(404, "Invalid acceas from user");
    }

    // find user and set refreshtoken to null
    await User.findByIdAndUpdate(
        user._id,
        { $set: { refreshToken: "" } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    // clearing cookies before response
    res.status(200)
    .clearCookie("sgAcceastoken")
    .clearCookie("sgRefreshtoken")
    .json(new APIresponse(200, "logged out sucessfully", null));
})

export { registerUser, loginUser, logoutUser };