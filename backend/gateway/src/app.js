import express from 'express'
import proxy from 'express-http-proxy'

const app = express();


app.use('/auth', proxy(process.env.AUTH_SERVICE));


app.get('/', (req, res) => {
    return res.status(200).json({message: 'Hello from gateway'})
})





export default app;