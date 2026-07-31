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

        const key = `sessionId:${sessionID}`
        await redis.hset(key, {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isVerified: String(user.isVerified)
        })
        await redis.expire(key, 7 * 24 * 60 * 60)

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


/**
 * @name    signUpHandler
 * @desc    handle signup using email and password local path 
 * @route   POST /hivemind/auth/sign-up
 * @param {*} req  name email password 
 * @returns 
 */
export const signUpHandler = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password)
        if (!email || !password) {
            throw new ApiError(400, "email, and password are required")
        }
        const normalisedEmail = email.toLowerCase().trim()
        const existingUser = await User.findOne({ email: normalisedEmail });
        if (existingUser) {
            throw new ApiError(409, "email is already been taken by a user!");
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        const user = await User.create({
            name: name || normalisedEmail.split('@')[0],
            email: normalisedEmail,
            password: hashedPassword,
            authProvider: 'local',
        })

        const sessionID = crypto.randomUUID();
        const key = `sessionId:${sessionID}`
        const cooldownKey = `otp-cooldown:${user.email}`;
        await redis.hset(key, {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isVerified: String(user.isVerified)
        })
        await redis.expire(key, 7 * 24 * 60 * 60)

        await redis.set(cooldownKey, "1", 'EX', 60);

        res.cookie("session", sessionID, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        const otp = crypto.randomInt(100000, 1000000).toString();

        await redis.set(`otp:${user.email}`, otp, 'EX', 300)

        await emailQueue.add('signup-otp', {
            type: 'signup-otp',
            to: user.email,
            otp: otp
        })

        const { password: userPassword, ...safeUser } = user._doc;

        return res.status(201).json(new ApiResponse(201, { user: safeUser }, 'user signed up successfully'))

    } catch (e) {
        next(e)
    }
}


/**
 * @name    loginHandler
 * @desc    handle login using email and password local path 
 * @route   POST /hivemind/auth/login
 * @param {*} req  email password 
 * @returns 
 */
export const loginHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(401, "Invalid email or password.");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid email or password.");
        }

        const sessionID = crypto.randomUUID();
        const key = `sessionId:${sessionID}`
        await redis.hset(key, {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isVerified: String(user.isVerified)
        })
        await redis.expire(key, 7 * 24 * 60 * 60)

        res.cookie("session", sessionID, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const { password: userPassword, ...safeUser } = user._doc;

        await emailQueue.add('login-user', {
            type: 'login-user',
            to: user.email,
            name: user.name
        })

        return res.status(200).json(new ApiResponse(201, { user: safeUser }, 'user logged in successfully'))

    } catch (e) {
        next(e)
    }
}


/**
 * @name    emailVerificationHandler
 * @desc    handle email verification by confirming otp 
 * @route   POST /hivemind/auth/email-verify
 * @param {*} req   otp
 * @returns 
 */

export const emailVerificationHandler = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const session = req.headers['x-cookie-session'];
        const user = req.user;
        const storedOtp = await redis.get(`otp:${user.email}`);

        if (!storedOtp) {
            throw new ApiError(400, "OTP has expired or is invalid.");
        }

        if (storedOtp !== otp) {
            throw new ApiError(400, "Invalid OTP.");
        }

        const existingUser = await User.findByIdAndUpdate(
            user._id,
            { $set: { isVerified: true } },
            { returnDocument: 'after' }   
        )

        if (!existingUser) {
            throw new ApiError(404, "User not found")
        }
        await redis.del(`otp:${user.email}`);
        await redis.hset(`sessionId:${session}`, {
            isVerified: "true"
        })
        return res.status(200).json(
            new ApiResponse(200, null, "Email verified successfully.")
        );

    } catch (e) {
        next(e);
    }
};

/**
 * @name    resendOtpHandler
 * @desc    handle to resend a new otp if the previous one expired or wasn't received
 * @route   POST /hivemind/auth/resend-otp
 * @access  private (requires authenticated session)
 * @returns 
 */
export const resendOtpHandler = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized. Please log in again.");
        }

        if (user.isVerified) {
            throw new ApiError(400, "Email is already verified.");
        }

        const cooldownKey = `otp-cooldown:${user.email}`;
        const isOnCooldown = await redis.get(cooldownKey);

        if (isOnCooldown) {
            throw new ApiError(429, "Please wait before requesting another OTP.");
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        await redis.set(`otp:${user.email}`, otp, 'EX', 300);
        await redis.set(cooldownKey, "1", 'EX', 60);

        await emailQueue.add('signup-otp', {
            type: 'signup-otp',
            to: user.email,
            otp: otp
        });

        return res.status(200).json(new ApiResponse(200, null, "OTP resent successfully."));

    } catch (e) {
        next(e);
    }
};


/**
 * @name    logoutHandler
 * @desc    handle user logout by clearing session from redis and cookie
 * @route   POST /hivemind/auth/logout
 * @access  private
 * @returns 
 */
export const logoutHandler = async (req, res, next) => {
    try {
        const session = req.headers['x-cookie-session'];

        if (sessionID) {
            const key = `sessionId:${session}`;
            await redis.del(key);
        }

        res.clearCookie("session", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res.status(200).json(new ApiResponse(200, null, "logged out successfully"));

    } catch (e) {
        next(e);
    }
};