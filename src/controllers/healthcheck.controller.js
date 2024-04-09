import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const healthcheck = asyncHandler(async(req,res)=>{
    //TODO: build a healthcheck response that simply return the ok status as json with a message

})

export {
    healthcheck
}