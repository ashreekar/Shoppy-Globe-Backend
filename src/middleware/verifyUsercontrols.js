import { APIresponse } from '../utils/APIResponse.js';
import { APIerror } from '../utils/APIError.js';
import { User } from '../models/user.model.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]+$/;

const verifyRegisterUserFields = (req, res, next) => {
    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some(val => val.trim() === "")) {
        throw new APIerror(400, "Fullname, username, email, password these fileds must be filled");
    }

    if (!nameRegex.test(fullName)) {
        throw new APIerror(400, "Full name must only contain letters and spaces (no numbers or special characters)");
    }

    if (fullName.length < 4 && fullName.length > 25) {
        throw new APIerror(400, "Fullname must have at least 4 characters and at most 25 characters");
    }

    if (!emailRegex.test(email)) {
        throw new APIerror(400, "Invalid email address");
    }

    if (password.length < 6) {
        throw new APIerror(400, "Password must be atleast 6 characters long");
    }

    next();
}

const verifyUserExists = async (req, res, next) => {
    const { email, username } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
        throw new APIerror(400, "User exists please login");
    }

    next();
}

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

export { verifyRegisterUserFields, verifyLoginUserFields, verifyUserExists };