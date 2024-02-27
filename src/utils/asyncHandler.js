//first method
const asyncHandler = (reqeustHandler) =>{
    (req,res,next) =>{
        Promise.resolve(reqeustHandler(req,res,next)).catch(
            (err)=> next(err)
        )
    }
}

export {asyncHandler}
















// second method
// const asyncHandler = (fn) => async (req,res,next) =>{
//     try {
//         await fn(req,res,next)        
//     } catch (error) {
//         res.error(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
//     }
// } 