import express from 'express';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.middleware.js';

const app = express();



app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



import chatRouter from './routes/chat.route.js';
app.use('/', chatRouter)


app.use(errorHandler)

export default app;