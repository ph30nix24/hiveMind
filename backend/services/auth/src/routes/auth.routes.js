import { Router } from 'express'

const authRouter = Router();

authRouter.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello From Auth"
    })
})

export default authRouter;