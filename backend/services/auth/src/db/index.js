import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);  // force Node to use Google DNS
dns.setDefaultResultOrder("ipv4first"); 

const connectDB = async () => {
    try {
        const res = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`MongoDB Connected: ${res.connection.host}`);
    } catch (error) {
        console.log("error while connecting to db: ", error.message);
        process.exit(1)
    }
}

export default connectDB;