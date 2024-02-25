import mongoose from "mongoose";

const prevYearDataSchema = new mongoose.Schema(
    {
        examination: {
            type: String,
            required: true,
        },
        university: {
            type: String,
            required: true,
        },
        session: {
            type: String,
            required: true,
        },
        auid: {
            type: String,
            require: true,
        },
        result: {
            type: String,
            enum: ["pass", "re-appear", "fail"],
        },
        marksMax: {
            type: Number,
            required: true,
        },
        marksObtained: {
            type: Number,
            required: true,
        },
        coursePassed: {
            type: [],
            require: true,
        },

        // some questions

        qus1: {
            type: Boolean,
            required: true,
        },
        qus2: {
            type: Boolean,
            required: true,
        },
        qus3: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PrevYearData = mongoose.model("PrevYearData", prevYearDataSchema);
