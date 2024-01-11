import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: "./.env",
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("app listen at port: ",process.env.PORT)
    })
})











// node --watch file.js
// import mongoose from "mongoose";
// import {DB_NAME} from './constants.js'
// import express from 'express'

// const app=express()

// (async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("Error",error);
//             throw error;
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App listen at ${process.env.PORT} port.`)
//         })
//     }catch(error){
//         console.log("Eroor: ",error);
//         throw error;
//     }
// })();
