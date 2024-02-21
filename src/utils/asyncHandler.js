// const asyncHandler=(fn)=>{
//     return (req,res,next)=>{
//          Promise.resolve(fn(req,res,next)).catch((error)=>next(error))
//     }
// }

const asyncHandler= (fn)=> async (req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (err) {
        res.status(err.statusCode).json(
            err
        )
        console.log(err)
    }
}


export {asyncHandler}