import { Router } from 'express'
import { googleLoginHandler } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello From Auth"
    })
})


authRouter.post('/google', googleLoginHandler);

export default authRouter;