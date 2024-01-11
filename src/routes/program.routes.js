import {Router} from 'express'
import {verifyJwt} from '../middlewares/auth.middleware.js'
import { allprogram, programBasedOnDepartment } from '../controllers/program.controller.js'


const programRoute=Router()

programRoute.use(verifyJwt)

programRoute.route("/programs").get(allprogram)

programRoute.route("/program-department/:departmentId").get(programBasedOnDepartment)

export {
    programRoute,
}