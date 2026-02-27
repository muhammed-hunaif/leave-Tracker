const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
    applyLeave,
    getActiveLeaveTypes,
    getLeaveTypes,
    getEmployeeLeaveSettings, updateLeaveSettings,
    getAllLeaves,
    getMyLeaves,
    leaveAction

} = require("../controllers/leaveController");

// leaves apply
router.post("/apply", authenticateToken, applyLeave);


// leavesTypes:casual, Earned ,sick, etc..,dropdown la show panrathu:
router.get("/leave-types/active", authenticateToken, getActiveLeaveTypes);


//leavesettings types edit:
//1.leaves types show panrathu:
router.get("/leave-types", authenticateToken, getLeaveTypes);
//2.GET leave settings:
router.get("/employee-leave-settings/:id", authenticateToken, getEmployeeLeaveSettings);
//3.Update leave settings:
router.put("/employee-leave-settings/update", authenticateToken, updateLeaveSettings);


// ADMIN VIEW LEAVES (with pagination)
//Query params: status (pending/approved/rejected), search (name/id/email)
router.get("/", authenticateToken, getAllLeaves);


//// EMPLOYEE LEAVE HISTORY:
//leave  history details page la show panrathu:
router.get("/my", authenticateToken, getMyLeaves);


// Approve / Reject
router.put("/:id/action", authenticateToken, leaveAction);

module.exports = router;
