import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";

const verifyJwtAdmin = asyncHandler(async function (req, res, next) {
    const token = req.cookies?.__accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorize request.");
    }

    //If Token
    let payload;
    try {
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.log(err);
        throw new ApiError(401, "Unauthorize request.");
    }

    const user = await Admin.findById(payload._id).select("-password");

    if (!user) {
        throw new ApiError(401, "Unauthorize request.");
    }
    req.user = user;
    next();
});

export { verifyJwtAdmin };
