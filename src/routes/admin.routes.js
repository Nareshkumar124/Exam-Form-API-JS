import Router from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { verifyJwtAdmin } from "../middlewares/admin.middleware.js";
import {
    approvedByAdmin,
    getFormsByClassId,
    formBasedOnUserId,
    login,
    register,
} from "../controllers/admin.controllers.js";

const adminRoute = Router();

// adminRoute.use(verifyJwt);
// adminRoute.use(verifyAdmin);

adminRoute.route("/approved").post(approvedByAdmin);
adminRoute.route("/forms-based-class").post(getFormsByClassId);
adminRoute.route("/form-based-user").post(formBasedOnUserId);
adminRoute.route("/admin-login").post(login);
adminRoute.route("/admin-register").post(register);

export { adminRoute };
