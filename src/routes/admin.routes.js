import Router from 'express'
import {verifyJwt} from '../middlewares/auth.middleware.js'
import {verifyAdmin} from '../middlewares/admin.middleware.js'
import {approvedByAdmin} from '../controllers/admin.controllers.js'

const adminRoute=Router();

adminRoute.use(verifyJwt)
adminRoute.use(verifyAdmin)


adminRoute.route("/approved").post(approvedByAdmin);

export {
    adminRoute,
}
