import mongoose from "mongoose";

// fucntion to connect to datatbase returns a promise
export const connectDataBase = async () => {
    try {
        const connectionInstence = await mongoose.connect("mongodb://localhost:27017/shoppy-globe");
        // connecting to a batabase name shoppy-globe
        // logging the host of mongodb
        console.log(`🗄️  Database connected: ${connectionInstence.connection.host}`);
    } catch (err) {
        console.log("❌ Database connection failed:", err);
        // ending the monododb process if exists error while connecting
        process.exit(1);
    }
}