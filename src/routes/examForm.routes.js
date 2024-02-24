import Router from 'express'
import {verifyJwt} from '../middlewares/auth.middleware.js'
import {formBasedOnId, getAllForms, submitFromData} from '../controllers/examForm.contoller.js'

const examFormRouter=Router()

examFormRouter.use(verifyJwt)
examFormRouter.route("/submit-form-data").post(submitFromData)
examFormRouter.route("/all-forms").get(getAllForms)
examFormRouter.route("/form-data/:_id").get(formBasedOnId)

export {
    examFormRouter,
}