const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {
  getEmployeeDashboardStats,
  createEmployee,
  getEmployeeDetails,
  getEmployeeById,
  updateEmployeeDetails,
  changeEmployeePassword,
} = require("../controllers/employeeController");

// CREATE EMPLOYEE:
router.post("/", authenticateToken, createEmployee);

// EMPLOYEE DETAILS:
router.get("/", authenticateToken, getEmployeeDetails);

// GET EMPLOYEE DASHBOARD STATS:
router.get("/dashboard-stats", authenticateToken, getEmployeeDashboardStats);

// GET ONE
router.get("/:id", authenticateToken, getEmployeeById);

// UPDATE employee details (name, email)
router.put("/:id", authenticateToken, updateEmployeeDetails);

// CHANGE PASSWORD
router.put("/:id/password", authenticateToken, changeEmployeePassword);

module.exports = router;
