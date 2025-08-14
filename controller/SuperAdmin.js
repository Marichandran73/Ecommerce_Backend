const Admin = require("../models/AdminDb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { LoginUser } = require('../models/user');



exports.SuperAdmin = async (req, res) => {
  try {
    const { username, email, password, role, isActive, moduleAccess } = req.body;

    if (!username || !email || !password || !role || isActive === undefined || !moduleAccess) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findUser = await Admin.findOne({ email });

    if (findUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role,
      isActive,
      moduleAccess,
    });

    await newAdmin.save();

    return res.status(201).json({ message: "SuperAdmin successfully created!" });
  } catch (error) {
    console.error("SuperAdmin creation failed:", error);
    return res.status(500).json({ message: "SuperAdmin creation failed", error: error.message });
  }
};

exports.getAdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const adminData = await Admin.findOne({ username });

    if (!adminData) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, adminData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: adminData._id, 
        username: adminData.username,
        role: adminData.role 
      }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token: token,
      username: adminData.username,
      role: adminData.role,
      email: adminData.email
    });

  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({
      message: "Error during admin login",
      error: error.message,
    });
  }
};

// print all user 

exports.getAllUsers = async (req ,res)=>{
  try {
    const users = await LoginUser.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({message: "Users retrieved successfully", users });
  } catch (error){
    console.error("Error retrieving users:", error);
    return res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
}
