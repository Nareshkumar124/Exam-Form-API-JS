import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { Types } from "mongoose";
import {
    validateAUID,
    validatePhoneNumber,
    isStrongPassword,
    isEmailValid,
} from "../utils/check.js";

const generateAcessAndRefereshTokens = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ ValidateBeforSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Token genrating failed.");
    }
};

const register = asyncHandler(async (req, res) => {
    const {
        auid,
        fullName,
        password,
        phoneNumber,
        email,
        fatherName,
        motherName,
        address,
    } = req.body;

    let userType = "S";
    let programId = undefined;
    if (!(req.body.role == "A")) {
        //check program id.
        programId = req.body.programId;
        if (!programId) {
            throw new ApiError(400, "Program id is requried.");
        }
    } else {
        userType = "A";
    }

    // If user wnat to register a admin.
    // if user is admin than they able to create admin.

    if (
        [
            auid,
            fullName,
            password,
            phoneNumber,
            email,
            fatherName,
            motherName,
            address,
        ].some((val) => val?.trim() === "" || val === undefined)
    ) {
        throw new ApiError(
            400,
            "auid,fullName,password,phoneNumber,programId,email,fatherName,motherName,address is requried."
        );
    }

    //Checks....
    if (!isStrongPassword(password)) {
        throw new ApiError(400, "Password must be strong");
    }
    if (!validateAUID(auid)) {
        throw new ApiError(400, "Auid is not valid.");
    }
    if (!validatePhoneNumber(phoneNumber)) {
        throw new ApiError(400, "Phone number is not valid.");
    }
    if (!isEmailValid(email)) {
        throw new ApiError(400, "Email is not valid.");
    }

    // check user already or not
    const existedUser = await User.findOne({ auid: auid });

    if (existedUser) {
        throw new ApiError(400, "User already exites.");
    }

    let avatarCloud;
    if (req.file) {
        avatarCloud = await uploadOnCloud(req.file);
        if (!avatarCloud) {
            throw new ApiError(500, "Failed to upload your file.");
        }
    }

    // create user and save in database

    const user = await User.create({
        auid: auid,
        password: password,
        fullName: fullName,
        phoneNumber: phoneNumber,
        avatar: avatarCloud?.url,
        programId: programId,
        email: email,
        fatherName: fatherName,
        motherName: motherName,
        address: address,
        role: userType,
    });

    if (user) {
        res.status(200).json(
            new ApiResponse(
                200,
                { _id: user._id, avatar: user.avatar },
                "User Created Successfully"
            )
        );
    } else {
        throw ApiError(500, "Internal Server Error");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { auid, password } = req.body;

    if (!(auid && password)) {
        throw new ApiError(400, "auid and password is requried.");
    }

    const user = await User.findOne({ auid });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Password is not valid");
    }

    const { accessToken, refreshToken } =
        await generateAcessAndRefereshTokens(user);

    const cookieOptions = [
        `HttpOnly`,
        `Secure`,
        `SameSite=None`,
        `Max-Age=${2 * 24 * 60 * 60}`,
        `Partitioned`,
        `Path=/`,
    ];

    // Concatenate the options to form the cookie string
    const cookieString = `__accessToken=${accessToken}; ${cookieOptions.join(
        "; "
    )}`;

    // Set the Set-Cookie header
    res.setHeader("Set-Cookie", cookieString);

    const user2 = await User.aggregate([
        {
            $match: {
                _id: user._id,
            },
        },
        {
            $lookup: {
                from: "programs",
                localField: "programId",
                foreignField: "_id",
                as: "course",
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "course.departmentId",
                foreignField: "_id",
                as: "department",
            },
        },

        {
            $addFields: {
                course: {
                    $arrayElemAt: ["$course", 0],
                },
                department: {
                    $arrayElemAt: ["$department", 0],
                },
            },
        },
    ]);
    user2[0].password = undefined;
    // console.log(user2[0])
    res.status(200)
        // .cookie("__accessToken", accessToken, options)
        // .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: user2[0], accessToken, refreshToken },
                "Login Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
    };

    res.status(200)
        .clearCookie("accessToken", options)
        // .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "User Logout SucessFully"));
});

const getUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // const user = await User.findById(userId).select("-password -refreshToken");

    const user = await User.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "programs",
                localField: "programId",
                foreignField: "_id",
                as: "course",
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "course.departmentId",
                foreignField: "_id",
                as: "department",
            },
        },

        {
            $addFields: {
                course: {
                    $arrayElemAt: ["$course", 0],
                },
                department: {
                    $arrayElemAt: ["$department", 0],
                },
            },
        },
    ]);
    user[0].password = undefined;
    res.status(200).json(
        new ApiResponse(200, user[0], "User fetched sucessfully.")
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const { fullName, phoneNumber, email, fatherName, motherName, address } =
        req.body;
    if (
        [fullName, phoneNumber, email, fatherName, motherName, address].some(
            (val) => val?.trim() === "" || val === undefined
        )
    ) {
        throw new ApiError(
            400,
            "fullName,phoneNumber,email,fatherName,motherName,address is requried."
        );
    }

    //Checks....
    if (!validatePhoneNumber(phoneNumber)) {
        throw new ApiError(400, "Phone number is not valid.");
    }
    if (!isEmailValid(email)) {
        throw new ApiError(400, "Email is not valid.");
    }

    const user = req.user;
    user.fullName = fullName;
    user.phoneNumber = phoneNumber;
    user.eamil = email;
    user.fatherName = fatherName;
    (user.motherName = motherName), (user.address = address);

    const updatedUser = await user.save();

    const user2 = await User.aggregate([
        {
            $match: {
                _id: user._id,
            },
        },
        {
            $lookup: {
                from: "programs",
                localField: "programId",
                foreignField: "_id",
                as: "course",
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "course.departmentId",
                foreignField: "_id",
                as: "department",
            },
        },

        {
            $addFields: {
                course: {
                    $arrayElemAt: ["$course", 0],
                },
                department: {
                    $arrayElemAt: ["$department", 0],
                },
            },
        },
    ]);
    user2[0].password = undefined;

    res.status(200).json(new ApiResponse(200, user2[0], "User is UpDate."));
});

const updateAvatar = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Image is requried");
    }

    //TODO: DELETE OLD IMAGE FROM CLOUD
    const cloudUrl = await uploadOnCloud(imageLocalPath);

    if (!cloudUrl) {
        throw new ApiError(500, "Internal Server error.");
    }

    const user = req.user;

    user.avatar = cloudUrl.url;

    await user.save();

    const user2 = await User.aggregate([
        {
            $match: {
                _id: user._id,
            },
        },
        {
            $lookup: {
                from: "programs",
                localField: "programId",
                foreignField: "_id",
                as: "course",
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "course.departmentId",
                foreignField: "_id",
                as: "department",
            },
        },

        {
            $addFields: {
                course: {
                    $arrayElemAt: ["$course", 0],
                },
                department: {
                    $arrayElemAt: ["$department", 0],
                },
            },
        },
    ]);
    user2[0].password = undefined;

    res.status(200).json(
        new ApiResponse(200, user2[0], "Image update sucessfully")
    );
});

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
        throw new ApiError(400, "oldpassword and newpassword is requried");
    }

    const strongPassword = isStrongPassword(newPassword);
    if (!strongPassword) {
        throw new ApiError(400, "Password must be strong.");
    }

    // Get User from database...
    const user = await User.findById(req.user._id);

    const passwordIsCorrect = await user.isPasswordCorrect(oldPassword);

    console.log(passwordIsCorrect);
    if (!passwordIsCorrect) {
        throw new ApiError(400, "Old Password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "Password change sucessfully.")
    );
});

// Under Testing
const fromIsLive = asyncHandler(async (req, res) => {
    // return req.user.formLive;
    res.status(200).json(
        new ApiResponse(
            200,
            { fromLive: req.user.formLive },
            "Check Live or not."
        )
    );
});

export {
    register,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
    updateAvatar,
    updatePassword,
    fromIsLive,
};
