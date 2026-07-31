import redis from '../../../../shared/redis/redis.js'
import ApiError from '../utils/ApiError.js'


const protect = async (req, res, next) => {
    const session = req.headers['x-cookie-session'];
    try {
        console.log("session: ", session)
        if(!session) {
            throw new ApiError(401,  "Session ID is required.")
        }

        const user = await redis.hgetall(`sessionId:${session}`)
        console.log("user: ", user)
        if(!user) {
            throw new ApiError(400, "Session Expired")
        }
        req.user = user
        next()
    } catch (e) {
        next(e)
    }
}

export default protect