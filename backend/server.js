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
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");



const app = express();
app.use(cors());
app.use(bodyParser.json());
connectDB();


app.use("/api/", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/leaves", leaveRoutes);


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




app.listen(3001, () => {
  console.log("Server running on port 3001");
});
