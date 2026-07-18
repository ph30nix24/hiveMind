import express from 'express'
import proxy from 'express-http-proxy'
import cors from 'cors'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler.middleware';
import protect from './middlewares/auth.middleware'
import { getCurrentUser } from './controller/user.controller';
const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true
}))


app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/hivemind/auth', proxy(process.env.AUTH_SERVICE));


app.get('/', (req, res) => {
    return res.status(200).json({message: 'Hello from gateway'})
})

app.get('/get-me', protect, getCurrentUser)
app.use(errorHandler)



export default app;