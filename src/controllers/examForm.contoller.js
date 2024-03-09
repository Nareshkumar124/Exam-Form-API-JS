import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ExaminationFrom } from "../models/examinationForm.models.js";
import { FromData } from "../models/formData.models.js";
import { PrevYearData } from "../models/prevYearData.model.js";
import { Types } from "mongoose";

//Under testing......

const submitFromData = asyncHandler(async (req, res) => {
    //Collect data from body
    let {
        regular,
        receiptNumber,
        fees,
        date,
        examination,
        university,
        session,
        auid,
        result,
        marksMax,
        marksObtained,
        coursePassed,
        qus1,
        qus2,
        qus3,
    } = req.body;

    console.log(req.body);

    // return res.json(req.body)
    // all data come or not.
    if (
        [
            regular,
            receiptNumber,
            fees,
            date,
            examination,
            university,
            session,
            auid,
            result,
            marksMax,
            marksObtained,
            coursePassed,
            qus1,
            qus2,
            qus3,
        ].some((val) =>
            typeof val === "string"
                ? val?.trim() === ""
                : false || val === undefined
        )
    ) {
        throw new ApiError(
            400,
            "regular,receiptNumber,fees and date is requrird examination,university,session,auid,result,marksMax,marksObtained,coursePassed,qus1,qus2,qus3"
        );
    }
    regular = Number(regular);
    qus1 = Number(qus1);
    qus2 = Number(qus2);
    qus3 = Number(qus3);

    //if user code regular then we requried subject code.

    let subjectCode = undefined;
    if (!regular) {
        subjectCode = req.body.subjectCode;
        if (!subjectCode) {
            throw new ApiError(400, "Subject Code is requried.");
        }
    }

    // insert data in dataBase

    //first insert prev year data;
    const prevData = await PrevYearData.create({
        examination,
        university,
        session,
        auid,
        result,
        marksMax,
        marksObtained,
        coursePassed,
        qus1,
        qus2,
        qus3,
    });

    const formEntryInDatabase = await FromData.create({
        regular,
        receiptNumber,
        fees,
        date,
        subjectCode,
        prevYearData: prevData._id,
    });

    const userWithFrom = await ExaminationFrom.findOne({ user: req.user._id });

    //if not already exists...........
    if (!userWithFrom) {
        await ExaminationFrom.create({
            user: req.user._id,
            forms: [formEntryInDatabase._id],
        });
    } else {
        //TODO: if from is type reguler check they already fill or not.....

        userWithFrom.forms.push(formEntryInDatabase._id);
        await userWithFrom.save();
    }
    res.status(200).json(
        new ApiResponse(200, formEntryInDatabase, "From data is submit")
    );
});

const getAllForms = asyncHandler(async (req, res) => {
    const user = req.user;

    const allForms = await ExaminationFrom.aggregate([
        {
            $match: {
                user: user._id,
            },
        },
        {
            $lookup: {
                from: "formdatas",
                localField: "forms",
                foreignField: "_id",
                as: "forms",
                pipeline: [
                    {
                        $lookup: {
                            from: "prevyeardatas",
                            localField: "prevYearData",
                            foreignField: "_id",
                            as: "prevYearData",
                        },
                    },
                    {
                        $addFields: {
                            prevYearData: {
                                $arrayElemAt: ["$prevYearData", 0],
                            },
                        },
                    },
                ],
            },
        },
    ]);

    res.status(200).json(
        new ApiResponse(200, allForms || null, "All forms Datas.")
    );
});

const getAllFromsId = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const formIds = await ExaminationFrom.findOne({
        user: userId,
    });

    console.log(formIds);
    res.status(200).json(
        new ApiResponse(200, formIds?.forms || null, "All form ids")
    );
});

const getFromDataBasedOnId = async function (formId) {


    const formData = await FromData.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(formId),
            },
        },

        {
            $lookup: {
                from: "prevyeardatas",
                localField: "prevYearData",
                foreignField: "_id",
                as: "prevYearData",
            },
        },

        {
            $addFields: {
                prevYearData: {
                    $arrayElemAt: ["$prevYearData", 0],
                },
            },
        },
    ]);

    if (!formData[0]) {
        throw new ApiError(
            404,
            "Form not found. Please enter a valid form id."
        );
    }

    return formData[0];



};

const formBasedOnId = asyncHandler(async (req, res) => {
    const formId = req.params._id; // Corrected variable name to formId
    if (!formId) {
        throw new ApiError(400, "Form id is required.");
    }
    const formData=await getFromDataBasedOnId(formId);

    res.status(200).json(
        new ApiResponse(200, formData, "Your form Data")
    );
});

//Api For form edit..
const updateFormData = asyncHandler(async (req, res) => {
    const formId = req.body._id;

    if (!formId) {
        throw new ApiError(400, "Form id is requried.");
    }

    const formData = await FromData.findById(formId);

    if(!formData){
        throw new ApiError(
            400,
            "From id is invalid."
        )
    }

    const { receiptNumber, fees, date } = req.body;

    if (
        [receiptNumber, fees, date].some(
            (val) => val?.trim() === "" || val === undefined
        )
    ) {
        throw new ApiError(400, "receiptNumber,fees and date requried.");
    }

    let subjectCode;
    if (!formData.regular) {
        subjectCode = req.body.subjectCode;

        if (!subjectCode) {
            throw new ApiError(400, "Subject Code is requried.");
        }
    }

    // Save all new Data
    formData.receiptNumber = receiptNumber;
    formData.fees = fees;
    formData.date = date;
    formData.subjectCode = subjectCode;

    const newFromData = await formData.save({ new: true });


    const newAllFormData=await getFromDataBasedOnId(formId)

    res.status(200).json(
        new ApiResponse(200, newAllFormData, "Form data update successful")
    );
});

const updatePrevYearDataUsingPrevYearDataId = async function (
    prevYearDataId,
    body
) {
    const prevYearData = await PrevYearData.findById(prevYearDataId);

    let {
        examination,
        university,
        session,
        auid,
        result,
        marksMax,
        marksObtained,
        coursePassed,
        qus1,
        qus2,
        qus3,
    } = body;

    qus1 = Number(qus1);
    qus2 = Number(qus2);
    qus3 = Number(qus3);

    const valArray = [
        examination,
        university,
        session,
        auid,
        result,
        marksMax,
        marksObtained,
        coursePassed,
        qus1,
        qus2,
        qus3,
    ];
    if (
        valArray.some((val) =>
            typeof val === "string"
                ? val?.trim() === ""
                : false || val === undefined
        )
    ) {
        throw new ApiError(
            400,
            "examination,university,session,auid,result,marksMax,marksObtained,coursePassed,qus1,qus2 and qus3 is requried"
        );
    }

    const dataObject = {
        examination,
        university,
        session,
        auid,
        result,
        marksMax,
        marksObtained,
        coursePassed,
        qus1,
        qus2,
        qus3,
    };

    for (const key in dataObject) {
        prevYearData[key] = dataObject[key];
    }

    const newPrevYearData = await prevYearData.save({ new: true });

    return newPrevYearData;
};

const updatePrevYearData = asyncHandler(async (req, res) => {
    const formId = req.body._id;

    if (!formId) {
        throw new ApiError(400, "FormId is requried.");
    }

    const formData = await FromData.findById(formId);

    if (!formData) {
        throw new ApiError(400, "From id is invalid.");
    }

    const prevYearDataId = formData.prevYearData;

    const newPrevYearData = await updatePrevYearDataUsingPrevYearDataId(
        prevYearDataId,
        req.body
    );

    const newAllFormData=await getFromDataBasedOnId(formId)

    res.status(200).json(new ApiResponse(200, newAllFormData, "PrevYearData is update"));
});



export {
    submitFromData,
    getAllForms,
    formBasedOnId,
    getAllFromsId,
    updateFormData,
    updatePrevYearData,
};
