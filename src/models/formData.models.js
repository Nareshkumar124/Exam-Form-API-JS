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
            type: Boolean,
            required: true,
            default: false,
        },
        approvedByHOD: {
            type: Boolean,
            required: true,
            default: false,
        },
        approvedByController: {
            type: Boolean,
            required: true,
            default: false,
        },
        isEditable:{
            type:Boolean,
            default:true
        },

        subjectCode:{
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const FromData = mongoose.model("FormData", fromDataSchema);
