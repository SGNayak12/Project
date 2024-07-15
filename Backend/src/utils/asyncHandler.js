const asyncHandler=(reqHandler)=>{
    (req,res,next)=>{
        Promise.resolve(reqHandler(req,res,next)).catch((err)=>next(err));
    }
}

export {asyncHandler}







// const asyncHandler=(fn)=>async (req,res,next)=>{
// try {
//    await fn(req,res,next);
// } catch (error) {
//     res.status(error.code||500).JSON({
//         success:true,
//         message:error.message
//     });
// }
// }