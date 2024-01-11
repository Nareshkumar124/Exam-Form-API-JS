import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { Router } from 'express'
import {Program} from '../models/program.models.js'



const allprogram=asyncHandler(async (req,res)=>{
    const programs=await Program.find().select("-departmentId")

    res.status(200)
    .json(
        new ApiResponse(
            200,
            programs,
            "All Programs"
        )
    )
})

const programBasedOnDepartment=asyncHandler(async (req,res)=>{

    const departmentId=req.params.departmentId;
    if(!departmentId){
        throw new ApiError(400,"departmentId is requried.")
    }

    const programs=await Program.find(
        {
            "departmentId":departmentId,
        }
    ).select("-departmentId")

    res.status(200).json(
        new ApiResponse(
            200,
            programs,
            "Program in given department",
        )
    )
})

export {
    allprogram,
    programBasedOnDepartment,
}