import {Router} from 'express'
import { getUser, loginUser, logoutUser, register } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import {verifyJwt} from '../middlewares/auth.middleware.js'



const userRouter=Router()

userRouter.route("/register").post(upload.single("avatar"),register);
userRouter.route("/login").post(loginUser)
export {userRouter};
userRouter.route("/logout").post(verifyJwt,logoutUser);
userRouter.route("/get-user").get(verifyJwt,getUser)