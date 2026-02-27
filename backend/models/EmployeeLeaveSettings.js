const mongoose = require("mongoose");

const leaveSettingSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },

  leaveBalances: [
    {
      leaveTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeaveType",
        required: true
      },
      days: {
        type: Number,
        default: 0
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("EmployeeLeaveSettings", leaveSettingSchema);
