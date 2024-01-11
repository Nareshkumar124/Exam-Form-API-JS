import Router from 'express'
import {verifyJwt} from '../middlewares/auth.middleware.js'
import { allDepartment } from '../controllers/department.controller.js';

const departmentRouter=Router()

departmentRouter.use(verifyJwt);
departmentRouter.route("/departments").get(allDepartment)
export {
    departmentRouter,
}