import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Router } from "express";
import { ExaminationFrom } from "../models/examinationForm.models.js";
import { FromData } from "../models/formData.models.js";

const submitFromData = asyncHandler(async (req, res) => {
    //Collect data from body
    let { regular, receiptNumber, fees, date } = req.body;

    // all data come not not
    if (
        [regular, receiptNumber, fees, date].some(
            (val) => val?.trim() === "" || val === undefined
        )
    ) {
        throw new ApiError(
            400,
            "regular,receiptNumber,fees and date is requrird"
        );
    }
    regular = Number(regular);

    //if user code regular then we requried subject code.
    let subjectCode = undefined;
    if (!regular) {
        subjectCode = req.body.subjectCode;
        if (!subjectCode) {
            throw new ApiError(400, "Subject Code is requried.");
        }
    }

    // insert data in dataBase
    const formEntryInDatabase = await FromData.create({
        regular,
        receiptNumber,
        fees,
        date,
        subjectCode,
    });
    
    const userWithFrom=await ExaminationFrom.findOne({user:req.user._id})

    //if not already exists...........
    if(!userWithFrom){
        await ExaminationFrom.create({
            user:req.user._id,
            forms:[formEntryInDatabase._id]
        })
    }else{
        //TODO: if from is type reguler check they already fill or not.....

        userWithFrom.forms.push(formEntryInDatabase._id)
        await userWithFrom.save()
    }
    res.status(200).json(
        new ApiResponse(
            200,
            formEntryInDatabase,
            "From data is submit"
        )
    );
});


const getAllForms=asyncHandler(async (req,res)=>{
    //TODO : Not SEND FULL DATA send only data that(Your Choice)
})


const formBasedOnId=asyncHandler(async(req,res)=>{

})

//Api For form edit..
//API From APROVEL...

export { submitFromData,getAllForms,formBasedOnId};
