import express from 'express';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.middleware.js';

const app = express();



app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



import authRouter from './routes/auth.routes.js';
app.use('/', authRouter)





app.use(errorHandler)

export default app;