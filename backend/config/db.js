const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/leave_management");
        console.log("Database connected");
    } catch (error) {
        console.log(error);
        // process.exit(1);
    }
};


module.exports = connectDB;