require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const User = require("./models/User");
const Employee = require("./models/Employee");
const Leave = require("./models/Leave");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeroutes");
const leaveRoutes = require("./routes/leaveRoutes");



const app = express();
const allowedOrigins = [
  "https://leave-tracker-system-azure.vercel.app",
  "https://leave-tracker-server.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(bodyParser.json());
connectDB().then(() => {
  console.log("Database initialized on startup");
}).catch(err => {
  console.error("FAILED to initialize database:", err);
});


app.use("/api/", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/leaves", leaveRoutes);

// Root route to verify backend is live
app.get("/", (req, res) => {
  res.send("Leave Tracker Backend is Running!");
});


// Admin Dashboard Stats
app.get("/api/admin/dashboard-stats", async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalLeaveRequests = await Leave.countDocuments();

    const pendingLeaves = await Leave.countDocuments({ status: "pending" });
    const approvedLeaves = await Leave.countDocuments({ status: "approved" });
    const rejectedLeaves = await Leave.countDocuments({ status: "rejected" });

    res.json({
      totalEmployees,
      totalLeaveRequests,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
