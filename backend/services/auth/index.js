import './src/loadEnv.js'
import connectDB from './src/db/index.js';
import app from './src/app.js'




const PORT = process.env.PORT || 4001;

connectDB()
    .then(async () => {
        await app.listen(PORT, () => {
            console.log(`Auth Running on ${PORT}`)
        })
    })
