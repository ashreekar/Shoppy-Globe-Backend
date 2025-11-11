import jwt from 'jsonwebtoken';
import { APIerror } from '../utils/APIError.js';

export const verifyJwt = async (req, res, next) => {
    try {
        const token = req?.cookies['sgAcceasToken'] || req.headers['authorization']?.replace("Bearer ", "")

        if (!token) {
            throw new APIerror(404, "Invalid acceas");
        }

        const user = jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET);

        if (!user) {
            throw new APIerror(404, "Invalid acceas");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new APIerror(400, "Verification failed");
    }
}