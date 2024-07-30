import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { FromData } from "../models/formData.models.js";
import mongoose from "mongoose";

// Under Testing
const approvedByAdmin = asyncHandler(async (req, res) => {
    let { formId, status, message } = req.body;

    if ([formId, status].some((val) => !val || val.trim() === "")) {
        throw new ApiError(400, "post,formId and status is required.");
    }

    status = Number(status);

    //Get form from database:
    const formData = await FromData.findById(formId);

    if (!formData) {
        throw new ApiError(500, "Form id is invalid");
    }

    const post = req.user.role;
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

async function getStudentFormsByProgram(programId) {
    try {
        const result = await mongoose.model("ExaminationFrom").aggregate([
            {
                // Match examination forms for users in the specific program
                $lookup: {
                    from: "users", // Collection name for users
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                // Filter by specific program
                $match: {
                    "userDetails.programId": new mongoose.Types.ObjectId(
                        programId
                    ),
                },
            },
            {
                // Unwind userDetails to process as separate documents
                $unwind: "$userDetails",
            },
            {
                // Lookup FormData for each form
                $lookup: {
                    from: "formdatas", // Collection name for form data
                    localField: "forms",
                    foreignField: "_id",
                    as: "formDataDetails",
                },
            },
            {
                // Project the required fields
                $project: {
                    _id: 0, // Exclude the _id from the output
                    userId: "$userDetails._id",
                    userName: "$userDetails.fullName",
                    programId: "$userDetails.programId",
                    forms: "$formDataDetails",
                },
            },
        ]);
        return result;
    } catch (error) {
        console.error("Error fetching student forms:", error);
        throw error;
    }
}

const getFormsByClassId = asyncHandler(async function (req, res) {
    const { classId } = req.body;

    if (!classId) {
        throw new ApiError(400, "Class id is required");
    }

    const data = await getStudentFormsByProgram(classId);
    res.status(200).json(new ApiResponse(200, data, "data of users."));
});

async function getFormDataByUserId(userId) {
    try {
        const result = await mongoose.model("ExaminationFrom").aggregate([
            {
                // Match examination forms for a specific user
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                // Lookup FormData for each form
                $lookup: {
                    from: "formdatas", // Collection name for FormData
                    localField: "forms",
                    foreignField: "_id",
                    as: "formDataDetails",
                },
            },
            {
                // Project the required fields
                $project: {
                    _id: 0, // Exclude the _id from the output
                    userId: "$user",
                    forms: "$formDataDetails",
                },
            },
        ]);

        return result;
    } catch (error) {
        console.error("Error fetching form data:", error);
        throw error;
    }
}

const formBasedOnUserId = asyncHandler(async function (req, res) {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(400, "user id is required");
    }

    const data = await getFormDataByUserId(userId);

    res.status(200).json(new ApiResponse(200, data, "User form data"));
});

export { approvedByAdmin, getFormsByClassId, formBasedOnUserId };
