import express from 'express'
import proxy from 'express-http-proxy'
import cors from 'cors'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler.middleware.js';
import protect from './middlewares/auth.middleware.js'
import { getCurrentUser } from './controller/user.controller.js';
import { plainProxy } from './utils/proxyWithHeader.js';
import cookieParser from 'cookie-parser'
const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true
}))

app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/hivemind/auth', plainProxy(process.env.AUTH_SERVICE));


app.get('/', (req, res) => {
    return res.status(200).json({message: 'Hello from gateway'})
})

app.get('/hivemind/user/get-me', protect, getCurrentUser)
app.use(errorHandler)



export default app;