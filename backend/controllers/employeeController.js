const Employee = require("../models/Employee");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Leave = require("../models/Leave");


// GET EMPLOYEE DASHBOARD STATS:
const getEmployeeDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employeeId = req.user.id;

    // Fetch leave stats from database
    const totalLeavesApplied = await Leave.countDocuments({
      employeeId,
      status: { $in: ["approved", "pending", "rejected"] }
    });

    const pendingLeaves = await Leave.countDocuments({
      employeeId,
      status: "pending"
    });

    const approvedLeaves = await Leave.countDocuments({
      employeeId,
      status: "approved"
    });

    const rejectedLeaves = await Leave.countDocuments({
      employeeId,
      status: "rejected"
    });

    // Get employee's total leaves
    const employee = await Employee.findById(employeeId);
    const totalLeaves = employee?.leave || 20;
    const remainingLeaves = totalLeaves - totalLeavesApplied;

    res.json({
      totalLeavesApplied,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      remainingLeaves: remainingLeaves > 0 ? remainingLeaves : 0
    });
  } catch (err) {
    console.log("Dashboard stats error:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
const createEmployee = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { employeeId, name, email, password, leave } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (leave === undefined || leave < 0) {
      return res.status(400).json({ message: "Leave must be 0 or more" });
    }

    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const idExists = await Employee.findOne({ employeeId });
    if (idExists) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      employeeId,
      name,
      email,
      password: hashedPassword,
      leave: Number(leave),
    });

    await newEmployee.save();

    res.status(201).json({ message: "Employee created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error creating employee" });
  }
};


//GET ALL EMPLOYEES DETAILS:
const getEmployeeDetails = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employees = await Employee.find().select(
      "employeeId name email leave"
    );

    res.status(200).json(employees);

  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};


//  GET SINGLE EMPLOYEE:
const getEmployeeById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employee = await Employee.findById(req.params.id).select(
      "employeeId name email leave"
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);

  } catch (error) {
    res.status(500).json({ message: "Error fetching employee" });
  }
};


// UPDATE EMPLOYEE:
const updateEmployeeDetails = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, leave } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (leave !== undefined) employee.leave = Number(leave);

    await employee.save();

    res.status(200).json({ message: "Employee updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error updating employee" });
  }
};


// CHANGE PASSWORD:
const changeEmployeePassword = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { adminPassword, newPassword } = req.body;

    const admin = await User.findById(req.user.id);
    const isCorrect = await bcrypt.compare(adminPassword, admin.password);

    if (!isCorrect) {
      return res.status(400).json({ message: "Admin password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Employee.findByIdAndUpdate(req.params.id, {
      password: hashedPassword,
    });

    res.json({ message: "Employee password updated" });

  } catch (error) {
    res.status(500).json({ message: "Password change failed" });
  }
};

module.exports = {
  getEmployeeDashboardStats,
  createEmployee,
  getEmployeeDetails,
  getEmployeeById,
  updateEmployeeDetails,
  changeEmployeePassword,
};