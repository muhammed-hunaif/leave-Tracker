const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  leaveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveType",
    required: true,
  },

  leaves: {
    type: Number,
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  actionReason: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);
