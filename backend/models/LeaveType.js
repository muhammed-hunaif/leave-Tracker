const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    default: "", 
  },

  status: {
    type: String,
    enum: ["active", "inactive"], 
    default: "active",
  },
  maxLeaves: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("LeaveType", leaveTypeSchema);
