import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";


const verifyJwt = asyncHandler(async function (req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorizes request.");
    }

    //If Token
    let payload;
    try {
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.log(err);
        throw new ApiError(401, "Unauthorizes request.");
    }

    const user = await User.findById(payload._id).select("-password");

    if (!user) {
        throw new ApiError(401, "Unauthorizes request.");
    }
    req.user = user;
    next();
});

export { verifyJwt };
