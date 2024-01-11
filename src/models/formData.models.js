import mongoose from "mongoose";

const fromDataSchema = new mongoose.Schema(
    {
        receiptNumber: {
            type: String,
            required: true,
            index: true,
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

        subjectCode: [
            {
                //reapper subject code if not regulare
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const FromData = mongoose.model("FormData", fromDataSchema);
