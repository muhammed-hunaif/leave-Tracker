// controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Employee = require("../models/Employee"); // ✅ ADD THIS




// 📝 SIGNUP
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("DEBUG SIGNUP ERROR:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// 🔐 LOGIN
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let account;

    if (role === "admin") {
      account = await User.findOne({ email });
    } else if (role === "employee") {
      account = await Employee.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    console.log("Account found, verifying password...");
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      console.error("CRITICAL ERROR: SECRET_KEY is not defined in environment variables!");
      return res.status(500).json({ message: "Server configuration error: SECRET_KEY missing" });
    }

    console.log("Signing token...");
    const token = jwt.sign(
      { id: account._id, email: account.email, role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Login successful for:", email);
    res.json({ token, role });

  } catch (err) {
    console.error("DEBUG LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

module.exports = {
  signup,
  login,
};
