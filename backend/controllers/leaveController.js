const Leave = require("../models/Leave");
const LeaveType = require("../models/LeaveType");
const Employee = require("../models/Employee");
const EmployeeLeaveSettings = require("../models/EmployeeLeaveSettings");


// leaves apply:
const applyLeave = async (req, res) => {
  try {
    const { leaveType, numOfLeaves, leaveReason } = req.body;

    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Only employee allowed" });
    }

    const employee = await Employee.findOne({ email: req.user.email });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Leave.create({
      employeeId: employee._id,
      leaveType,
      leaves: Number(numOfLeaves),
      reason: leaveReason,
      status: "pending",
    });

    res.json({ message: "Leave applied, waiting for approval" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//  leavesTypes:casual, Earned ,sick, etc..,dropdown la show panrathu:
const getActiveLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({ status: "active" }).sort({ name: 1 });
    res.json(leaveTypes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//leavesettings types edit:
//1.leaves types show panrathu:
const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({ status: "active" }).sort({ name: 1 });
    res.json(leaveTypes);
  } catch (err) {
    console.error("LeaveTypes Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2.GET leave settings:
const getEmployeeLeaveSettings = async (req, res) => {
  try {
    let settings = await EmployeeLeaveSettings.findOne({ employeeId: req.params.id })
      .populate("leaveBalances.leaveTypeId");

    if (!settings) {
      return res.json({ leaveBalances: [] });
    }

    res.json(settings);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 3.Update leave settings:
const updateLeaveSettings = async (req, res) => {
  try {
    const { employeeId, leaveTypeId, days } = req.body;

    let settings = await EmployeeLeaveSettings.findOne({ employeeId });

    if (!settings) {
      settings = new EmployeeLeaveSettings({ employeeId, leaveBalances: [] });
    }

    const index = settings.leaveBalances.findIndex(
      l => l.leaveTypeId.toString() === leaveTypeId
    );

    if (index > -1) {
      //  REPLACE old value
      settings.leaveBalances[index].days = Number(days);
      //First time entry
    } else {
      settings.leaveBalances.push({ leaveTypeId, days: Number(days) });
    }

    await settings.save();

    res.json({ message: "Leave balance updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ADMIN VIEW LEAVES (with pagination)
// Query params: status (pending/approved/rejected), search (name / employeeId / email)
const getAllLeaves = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status, search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // ✅ Build leave filter (status)
    let leaveFilter = {};
    if (status) leaveFilter.status = status;

    // ✅ If search term exists, find matching employees FIRST (before pagination)
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i"); // case-insensitive partial match

      const matchedEmployees = await Employee.find({
        $or: [
          { name: regex },
          { email: regex },
          { employeeId: regex },
        ],
      }).select("_id");

      // Filter leaves to only those whose employee matched
      leaveFilter.employeeId = { $in: matchedEmployees.map((e) => e._id) };
    }

    // ✅ Count FILTERED total for correct pagination
    const total = await Leave.countDocuments(leaveFilter);

    // ✅ Fetch paginated leaves from filtered set
    const leaves = await Leave.find(leaveFilter)
      .populate("employeeId", "employeeId name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      leaves,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// EMPLOYEE LEAVE HISTORY:
//leave  history details page la show panrathu:
const getMyLeaves = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employee = await Employee.findOne({ email: req.user.email });

    const leaves = await Leave.find({ employeeId: employee._id })
      .populate("employeeId", "employeeId name email");

    res.status(200).json(leaves);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ADMIN APPROVE / REJECT
const leaveAction = async (req, res) => {
  try {
    const { status, actionReason } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.id).populate("employeeId");

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    // ✅ If approved → subtract leave balance
    if (status === "approved") {
      if (typeof leave.employeeId.leave !== "number") {
        leave.employeeId.leave = 0; // safety
      }

      leave.employeeId.leave -= leave.leaves;

      if (leave.employeeId.leave < 0) {
        leave.employeeId.leave = 0; // prevent negative
      }

      await leave.employeeId.save();
    }

    //save action details:
    leave.status = status;
    leave.actionReason = actionReason || "";

    await leave.save();

    res.json({ message: `Leave ${status} successfully` });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  applyLeave,
  getEmployeeLeaveSettings,
  getActiveLeaveTypes,
  getLeaveTypes,
  updateLeaveSettings,
  getAllLeaves,
  getMyLeaves,
  leaveAction
}