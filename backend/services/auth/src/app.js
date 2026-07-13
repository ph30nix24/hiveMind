import express from 'express';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.middleware.js';
const app = express();



app.use(morgan('dev'))


app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello From Auth"
    })
})


app.use(errorHandler)

export default app;