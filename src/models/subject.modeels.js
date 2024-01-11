import mongoose from 'mongoose'

const subjectScheam=new mongoose.Schema(
    {
        subjectName:{
            type:String,
            required:true,
        },
        programs: [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Program"
            }
        ] 
    },
)

export const Subject=mongoose.model("Subject",subjectScheam);