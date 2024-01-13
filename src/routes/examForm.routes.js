import Router from 'express'
import {verifyJwt} from '../middlewares/auth.middleware.js'
import {submitFromData} from '../controllers/examForm.contoller.js'

const examFormRouter=Router()

examFormRouter.use(verifyJwt)
examFormRouter.route("/submit-form-data").post(submitFromData)

export {
    examFormRouter,
}