import mongoose from "mongoose";
import { DatabaseName } from "../constants.js";

const connectDb = async () => {
        try {
            const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DatabaseName}`)
            console.log(`Mongodb connected DB Host : ${connectionInstance.connection.host} `)
            // console.log(connectionInstance)

        } catch (error) {
            console.error("Connection error:", error)
            process.exit(1)
        }
}

export default connectDb