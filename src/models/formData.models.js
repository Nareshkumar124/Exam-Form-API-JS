import mongoose from "mongoose";

const fromDataSchema = new mongoose.Schema(
    {
        receiptNumber: {
            type: String,
            required: true,
            index: true,
            unique:true,
        },
        fees: {
            type: Number,
            require: true,
        },
        date: {
            type: mongoose.Schema.Types.Date,
            require: true,
        },
        regular: {
            type: Boolean,
            required: true,
        },

        prevYearData:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"PrevYearData"
            
        },
        approvedByMentor: {
            type: Number,
            enum:[-1,0,1],
            required: true,
            default: 0,
        },
        approvedByHOD:  {
            type: Number,
            enum:[-1,0,1],
            required: true,
            default: 0,
        },
        approvedByController:  {
            type: Number,
            enum:[-1,0,1],
            required: true,
            default: 0,
        },
        isEditable:{
            type:Boolean,
            default:true
        },

        subjectCode:{
            type: String,
        },

        message:{
            type:[
                {
                    type:String
                }
            ]
        }
    },
    {
        timestamps: true,
    }
);

export const FromData = mongoose.model("FormData", fromDataSchema);
