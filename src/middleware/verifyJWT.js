import jwt from 'jsonwebtoken';
import { APIerror } from '../utils/APIError.js';

// verifyJwt is a middleware which checks whether user is logged in or not
// while accesing a resource
export const verifyJwt = async (req, res, next) => {
    try {
        // getting token by  either cookies or headers with Authorization header
        const token = req?.cookies['sgAcceasToken'] || req.headers['authorization']?.replace("Bearer ", "")

        if (!token) {
            throw new APIerror(404, "Invalid acceas");
        }

        // Token is handled by jwt and gives the user object by decoding it
        const user = jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET);

        if (!user) {
            throw new APIerror(404, "Invalid acceas");
        }

        // adding a user object to req
        req.user = user;
        next();
    } catch (error) {
        throw new APIerror(400, "Verification failed");
    }
}