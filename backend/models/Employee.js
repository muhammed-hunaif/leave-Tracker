const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    leave: {
      type: Number,
      required: true,
      min: 0, // ✅ leave negative ah irukka koodathu
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", EmployeeSchema);
