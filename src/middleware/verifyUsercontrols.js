import { APIresponse } from '../utils/APIResponse.js';
import { APIerror } from '../utils/APIError.js';
import { User } from '../models/user.model.js';
import { Vendor } from '../models/vendor.model.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]+$/;

// verify register user fields verifies all fields that needed to reguster a user
const verifyRegisterUserFields = (req, res, next) => {
    const { fullName, username, email, password } = req.body;

    // throws error if any of below fields is missing
    if ([fullName, username, email, password].some(val => val.trim() === "")) {
        throw new APIerror(400, "Fullname, username, email, password these fileds must be filled");
    }

    // tesiting if name is valid like don't have number or symbols
    if (!nameRegex.test(fullName)) {
        throw new APIerror(400, "Full name must only contain letters and spaces (no numbers or special characters)");
    }

    // limiting nme lenght
    if (fullName.length < 4 && fullName.length > 25) {
        throw new APIerror(400, "Fullname must have at least 4 characters and at most 25 characters");
    }

    // checking for valid email
    if (!emailRegex.test(email)) {
        throw new APIerror(400, "Invalid email address");
    }

    if (password.length < 6) {
        throw new APIerror(400, "Password must be atleast 6 characters long");
    }

    next();
}

// checks whether user exists while regustering
const verifyUserExists = async (req, res, next) => {
    const { email, username } = req.body;

    // checks whether email or username to check for user exists or not
    const userExists = await User.findOne(
        {
            $or: [{ email }, { username }]
        }
    );

    if (userExists) {
        throw new APIerror(400, "User exists please login");
    }

    next();
}

// this middleware finds where regustering vendor exists in db or not
const verifyVendorExists = async (req, res, next) => {
    const { email, username } = req.body;

    // checks for email or username to check existence
    const userExists = await Vendor.findOne(
        { 
            $or: [{ email }, { username }] 
        }
    );

    if (userExists) {
        throw new APIerror(400, "User exists please login");
    }

    next();
}

// just cheking either email, username and password exists in req.body
const verifyLoginUserFields = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new APIerror(400, "username, email, is required");
    }

    if (!password) {
        throw new APIerror(400, "password is required");
    }

    next();
}

export { verifyRegisterUserFields, verifyLoginUserFields, verifyUserExists, verifyVendorExists };