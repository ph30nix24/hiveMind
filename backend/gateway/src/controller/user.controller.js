import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"


export const getCurrentUser = async (req, res, next) => {
    try {
        const user = req.user
        if(!user) {
            throw new ApiError(404, "user not found")
        }
        return res.status(200).json(new ApiResponse(200, user, "Successfully fetched the user"))
    }
    catch (e) {
        next(e)
    }
}