import mongoose from 'mongoose'

const examinationFormSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        forms:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"FormData"
            }
        ]
    },
    {
        timestamps:true
    }
)

export const ExaminationFrom=mongoose.model("ExaminationFrom",examinationFormSchema);