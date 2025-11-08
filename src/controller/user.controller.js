import { User } from "../models/user.model.js";
import { asyncHandler } from '../utils/AsyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;
})