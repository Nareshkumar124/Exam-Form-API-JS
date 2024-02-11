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
            type: [String, "Auid or roll number."],
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
            type: String,
            required: true,
        },
        coursePassed: {
            type: [],
            require: true,
        },

        // some questions

        qus1: {
            type: [Boolean, "Have you ever been disqualified."],
            required: true,
        },
        qus2: {
            type: [
                Boolean,
                "Are you appearing two examination simultaneously.",
            ],
            required: true,
        },
        qus3: {
            type: [Boolean, "Have you appied for re-evalution of lower"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PrevYearData = mongoose.model("PrevYearData", prevYearDataSchema);
