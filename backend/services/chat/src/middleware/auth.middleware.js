import redis from '../../../../shared/redis/redis.js'
import ApiError from '../utils/ApiError.js'


const protect = async (req, res, next) => {
    const session = req.cookie?.session;
    try {
        if(!session) {
            throw new ApiError(401,  "Session ID is required.")
        }
        const user = await redis.hgetall(`sessionId:${session}`)
        if(!user) {
            throw new ApiError(400, "Session Expired")
        }
        req.user = user
        next()
    } catch {
        next(e)
    }
}

export default protect