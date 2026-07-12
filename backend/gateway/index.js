import './src/loadEnv.js'

import app from "./src/app.js";

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Gateway listening on ${port}`)
})