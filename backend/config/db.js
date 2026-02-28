const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.00.1:27017/leave_management", {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
        });
        console.log("Database connected smoothly");
    } catch (error) {
        console.error("Critical: Database connection failed!", error);
    }
};


module.exports = connectDB;