import { APIresponse } from '../utils/APIResponse.js';
import { APIerror } from '../utils/APIError.js';

const verifyRegisterUserFields = (req, res, next) => {
    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some(val => val.trim() === "")) {
        throw new APIerror(400, "Fullname, username, email, password these fileds must be filled");
    }

    if (false) {
        throw new APIerror(400, "Fullname must not have numbers or characters");
    }

    if (fullName.length < 4 && fullName.length > 25) {
        throw new APIerror(400, "Fullname must have at least 4 characters and at most 25 characters");
    }

    if (false) {
        throw new APIerror(400, "Invalid email adress");
    }

    if (password.length < 6) {
        throw new APIerror(400, "Password must be atleast 6 characters long");
    }

    next();
}

const verifyLoginUserFields = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email) {
        throw new APIerror(400, "username, email, is required");
    }

    if (!password) {
        throw new APIerror(400, "password is required");
    }

    next();
}

export { verifyRegisterUserFields, verifyLoginUser };