import { Router } from 'express'
import { emailVerificationHandler, googleLoginHandler, loginHandler, signUpHandler } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello From Auth"
    })
})

/**
 * @name    googleLogin
 * @route   POST /hivemind/auth/google
 * @access  public
 */
authRouter.post('/google', googleLoginHandler);


/**
 * @name    signUpRoute
 * @route   POST /hivemind/auth/sign-up
 * @access  public
 */
authRouter.post('/sign-up', signUpHandler)

/**
 * @name    loginRoute
 * @route   POST /hivemind/auth/login
 * @access  public
 */
authRouter.post('/login', loginHandler)


/**
 * @name    emailVerificationRoute
 * @route   POST /hivemind/auth/email-verify
 * @access  public
 */
authRouter.post('/email-verify', protect, emailVerificationHandler)


export default authRouter;