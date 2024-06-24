import Router from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    formBasedOnId,
    getAllForms,
    getAllFormsId,
    submitFromData,
    updateFormData,
    updatePrevYearData,
} from "../controllers/examForm.controller.js";

const examFormRouter = Router();

examFormRouter.use(verifyJwt);
examFormRouter.route("/submit-form-data").post(submitFromData);
examFormRouter.route("/all-forms").get(getAllForms);
examFormRouter.route("/form-data/:_id").get(formBasedOnId);
examFormRouter.route("/form-ids").get(getAllFormsId);
examFormRouter.route("/update-from-data").patch(updateFormData);
examFormRouter.route("/update-prev-year-data").patch(updatePrevYearData);

export { examFormRouter };
