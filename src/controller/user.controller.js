import { User } from "../models/user.model.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import { APIresponse } from '../utils/APIResponse.js'
import { APIerror } from "../utils/APIError.js";

const generateAcceasTokenAndRefreshToken = async (id) => {
    try {
        const user = await User.findById(id);

        const acceasToken = await user.generateAcceasToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { acceasToken, refreshToken };
    } catch (error) {
        throw new APIerror(500, "Something went wrong while generating acceas token and refresh token", error);
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

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

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
        throw new APIerror(404, "User not found");
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new APIerror(401, "Incorrect password");
    }

    const { acceasToken, refreshToken } = await generateAcceasTokenAndRefreshToken(user._id);

    const loggeduser = await User.findById(user._id).
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
                user: loggeduser,
                acceasToken,
                refreshToken
            }
        ))
})

const logoutUser = asyncHandler(async (req, res) => {
    const userBody = req.user;

    if (!user) {
        throw new APIerror(404, "Invalid acceas from user");
    }

    await User.findByIdAndUpdate(
        userBody._id,
        { $set: { refreshToken: "" } },
        { new: true }
    );

     const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).clearCookie("sgacceastoken").clearCookie("sgrefreshtoken").json(new APIresponse(200, "logged out sucessfully", null));
})

export { registerUser, loginUser };