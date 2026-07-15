import User from '../model/user.model.js'
import { firebaseApp } from '../config/firebase.config.js'
import { getAuth } from 'firebase-admin/auth';
import crypto from 'crypto'
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js'
import bcrypt from 'bcryptjs';
import redis from '../../../../shared/redis/redis.js';
import { emailQueue } from '../queues/email.queue.js';



/**
 * @name    googleLoginHandler
 * @desc    handle to login through firebase
 * @route   POST /hivemind/auth/google
 * @access  public
 * @returns user
 */
export const googleLoginHandler = async (req, res, next) => {
    try {
        const { token } = req.body;
        const decoded = await getAuth(firebaseApp).verifyIdToken(token)

        const { name, uuid, email, picture } = decoded

        let user = await User.findOne({ firebaseUID: uuid });

        if (!user) {
            user = await User.create({
                name: name || email.split("@")[0],
                email,
                authProvider: "firebase",
                isVerified: true,
                avatar: picture
            })

            await emailQueue.add('welcome-user', {
                type: 'welcome-user',
                to: user.email,
                name: user.name
            })
        } else {
            await emailQueue.add('login-user', {
                type: 'login-user',
                to: user.email,
                name: user.name
            })
        }

        const sessionID = crypto.randomUUID();

        redis.set(`sessionId:${sessionID}`, JSON.stringify({
            _id: user._id
        }), 'EX', 7 * 24 * 60 * 60)

        res.cookie("session", sessionID, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })



        return res.status(200).json(new ApiResponse(200, user, "successfully logged in user"))
    } catch (e) {
        next(e)
    }
}

export const signUpHandler = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(409, "email, and password are required")
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            throw new ApiError(400, "Name, email, and password are required");
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        const user = await User.create({
            name: name || email.split('@')[0],
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            authProvider: 'local',
        })

        const sessionID = crypto.randomUUID();

        await redis.set(`sessionId:${sessionID}`, JSON.stringify({
            _id: user._id
        }), 'EX', 7 * 24 * 60 * 60)

        res.cookie("session", sessionID, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        const otp = crypto.randomInt(100000, 1000000).toString();

        await redis.set(`otp:${user.email}`, otp, 'EX', 300)

    } catch (e) {
        next(e)
    }
}

