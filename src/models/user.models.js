import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema(
    {
        auid:{
            type:String,
            required:true,
            unique:true,
            index:true,
        },

        fullName:{
            type:String,
            required:true,
        },

        password:{
            type:String,
            required:true,
        },

        phoneNumber:{
            type:String,
            required:true,
            unique:true,
        },

        email:{
            type:String,
        },

        avatar:{
            type:String,
            required:true
        },

        fatherName:{
            type:String,
        },

        motherName:{
            type:String,
        },

        address:{
            type:String,
        },
        programId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Program"
        },
        refreshToken: {
            type: String,
        },

    },
    {
        timestamps:true
    }
)

userSchema.pre(
    "save",
    async function(next){
        if(this.isModified("password")){
            this.password=await bcrypt.hash(this.password,10)
        }
        next()
    }
)

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            auid:this.auid,
            _id:this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}



export const User=mongoose.model("User",userSchema);

