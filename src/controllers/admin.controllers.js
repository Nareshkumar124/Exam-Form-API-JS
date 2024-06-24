import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { FromData } from "../models/formData.models.js";

// Under Testing
const approvedByAdmin = asyncHandler(async (req, res) => {
    let { post, formId, status, message } = req.body;
    const adminPostOption = ["M", "H", "C"];

    if ([post, formId, status].some((val) => !val || val.trim() === "")) {
        throw new ApiError(400, "post,formId and status is required.");
    }

    status = Number(status);

    if (!adminPostOption.includes(post)) {
        throw new ApiError(400, "Admin post is invalid.");
    }

    //Get form from database:
    const formData = await FromData.findById(formId);

    if (!formData) {
        throw new ApiError(500, "Form id is invalid");
    }

    if (post == "M") {
        formData.approvedByMentor = status;
    } else if (post == "H") {
        formData.approvedByHOD = status;
    } else if (post == "C") {
        formData.approvedByController = status;
    }

    if (message) {
        formData.message.push(message);
    }

    // Work on isEditable
    // If any one reject the from and set all those to normal
    if (status == -1) {
        if (post == "M") {
            formData.approvedByHOD = 0;
            formData.approvedByController = 0;
        } else if (post == "H") {
            formData.approvedByMentor = 0;
            formData.approvedByController = 0;
        } else if (post == "C") {
            formData.approvedByHOD = 0;
            formData.approvedByMentor = 0;
        }
    }

    const approvedArray = [
        formData.approvedByController,
        formData.approvedByHOD,
        formData.approvedByMentor,
    ];
    // console.log(approvedArray);

    let edit = true;
    for (const i of approvedArray) {
        if (i === 1) {
            formData.isEditable = false;
            edit = false;
        }
    }

    if (edit) {
        formData.isEditable = true;
    }

    const updatedFrom = await formData.save({ new: true });

    res.status(200).json(
        new ApiResponse(200, updatedFrom, "Form Data is updated.")
    );
});

const formAccordingToClass = asyncHandler(async (req, res) => {});
export { approvedByAdmin };
