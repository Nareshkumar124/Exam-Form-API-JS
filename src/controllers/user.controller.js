import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {uploadOnCloud} from '../utils/cloudinary.js'
import {User} from '../models/user.models.js'
import {validateAUID,validatePhoneNumber,isStrongPassword} from '../utils/check.js'

const generateAcessAndRefereshTokens = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ ValidateBeforSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Token genrating failed.");
    }
};


const register=asyncHandler(async (req,res)=>{
    const {auid,fullName,password,phoneNumber,programId}=req.body

    if([auid,fullName,password,phoneNumber,programId].some((val)=>(val?.trim()==="" || val===undefined))){
        throw new ApiError(400,"auid,fullName,password,phoneNumber,programId is requried.")
    }

    //Checks....
    if(!isStrongPassword(password)){
        throw new ApiError(400,"Password must be strong")
    }
    if(!validateAUID(auid)){
        throw new ApiError(400,"Auid is not valid.")
    }
    if(!validatePhoneNumber(phoneNumber)){
        throw new ApiError(400,"Phone number is not valid.")
    }

    // check user already or not
    const existedUser=await User.findOne({auid:auid})

    if(existedUser){
        throw new ApiError(400,"User already exites.");
    }

    let avatarCloud;
    if(req.file){
        avatarCloud=await uploadOnCloud(req.file.path)
    }else{
        throw new ApiError(400,"Avatar file is requried");
    }

    if(!avatarCloud){
        throw ApiError(500,"Failed to upload your file.")
    }

    // create user and save in database

    const user=await User.create({
        auid:auid,
        password:password,
        fullName:fullName,
        phoneNumber:phoneNumber,
        avatar:avatarCloud.url,
        programId:programId,
        email:req.body.email || "",
        fatherName:req.body.fatherName || "",
        motherName:req.body.motherName || "",
    })

    if(user){
        res.status(200)
        .json(new ApiResponse(200,{_id:user._id,avatar:user.avatar},"User Created Successfully"));
    }else{
        throw ApiError(500,"Internal Server Error");
    }

})

const loginUser = asyncHandler(async (req, res) => {
    const { auid,password } = req.body;

    if (!(auid && password)) {
        throw new ApiError(400, "auid and password is requried.");
    }

    const user = await User.findOne({auid});

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Password is not valid");
    }

    const { accessToken, refreshToken } =
        await generateAcessAndRefereshTokens(user);


    const options = {
        httpOnly: true,
        secure: true,
    };
    user.password=undefined;

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "Login Successfully"
            )
        );
});

const logoutUser=asyncHandler(async (req,res)=>{
    const userId=req.user?._id;

    await User.findByIdAndUpdate(
        userId,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true,
    }

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(
        200,
        null,
        "User Logout SucessFully"
    ))
})

const getUser=asyncHandler(async (req,res)=>{
    const userId=req.user?._id;

    const user=await User.findById(userId).select("-password -refreshToken");

    res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User fetched sucessfully."
        )
    )
})
export {
    register,
    loginUser,
    logoutUser,
    getUser,
}

