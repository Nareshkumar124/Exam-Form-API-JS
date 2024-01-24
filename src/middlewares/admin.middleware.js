import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async function (req, _ , next) {
    if(req.user.role=="A") next();
    else{
        throw new ApiError(400,"User must be an admin");
    }
    
});

export { verifyAdmin };
