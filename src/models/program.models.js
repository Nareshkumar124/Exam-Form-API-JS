import mongoose from 'mongoose'

const programSchema=new mongoose.Schema(
    {
        programName:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,
            require:true
        },
        sem:{
            type:Number,
            require:true,
        },
        departmentId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Department"
        }
    }
)

export const Program=mongoose.model("Program",programSchema);