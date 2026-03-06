const mongoose = require("mongoose");


let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/leave_management", {
            serverSelectionTimeoutMS: 5000,
        });
        cachedConnection = conn;
        console.log("Database connected smoothly");
        return conn;
    } catch (error) {
        console.error("Critical: Database connection failed!", error);
        throw error;
    }
};


module.exports = connectDB;