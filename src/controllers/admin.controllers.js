import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {FromData} from '../models/formData.models.js'


// Under Testing
const approvedByAdmin=asyncHandler(async (req,res)=>{

    const {post,formId}=req.body;
    const adminPostOption=["M","H","C"];

    if(!(adminPostOption.includes(post))){
        throw new ApiError(400,"Admin post is invalid.")
    }

    //Get form from database:
    const formData=await FromData.findById(formId);

    if(!formData){
        throw new ApiError(400,"Form id is invalid");
    }

    if(post=="M"){
        formData.approvedByMentor=true;
    }
    else if(post=="H"){
        formData.approvedByHOD=true;
    }

    else if(post=="C"){
        formData.approvedByController=true
    }

    const updatedFrom=formData.save({new:true})

    res.status(200).json(
        new ApiResponse(
            200,
            updatedFrom,
            "Form Data is updated.",
        )
    )


})

export {
    approvedByAdmin,
}