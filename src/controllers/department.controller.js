import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { Router } from 'express'
import {Department} from '../models/department.models.js'


const allDepartment=asyncHandler(async (req,res)=>{
    const departments=await Department.find()

    res.status(200).json(
        new ApiResponse(200,departments,"All department")
    )
})

export {
    allDepartment,
}