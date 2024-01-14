import { Router } from "express";
import {
    fromIsLive,
    getUser,
    loginUser,
    logoutUser,
    register,
    updateAvatar,
    updatePassword,
    updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import multer from "multer";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), register);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJwt, logoutUser);
userRouter.route("/get-user").get(verifyJwt, getUser);
userRouter.route("/update-user").patch(verifyJwt, updateUser);
userRouter.route("/update-avatar").patch(verifyJwt,upload.single("avatar"), updateAvatar);
userRouter.route("/update-password").patch(verifyJwt, updatePassword);
userRouter.route("/form-live").get(verifyJwt,fromIsLive)

export { userRouter };
