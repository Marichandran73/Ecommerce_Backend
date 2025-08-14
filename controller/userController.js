const  LoginUser  = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.Signup = async (req, res) => {
  try {
    let { name, age, contact, email, password } = req.body;

    name = name?.trim();
    contact = contact?.trim();
    email = email?.trim();
    age = Number(age);

    if (!name || !age || !contact || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Invalid age" });
    }

    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ message: "Enter a valid 10-digit contact number" });
    }

  
    const findUser = await LoginUser.findOne({ email });
    if (findUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

  
    const newUser = new LoginUser({
      name,
      age,
      contact,
      email,
      password: hashPassword,
    });
    const savedUser = await newUser.save();


    // Remove password before sending
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return res.status(201).json({
      message: "User successfully saved!",
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await LoginUser.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      token,
      userId: user._id,
      message: "Login successfully",
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};


exports.UserProfile = async (req, res) => {
  const { userId } = req.params; 

  try {
    const user = await LoginUser.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User Profile Fetched Successfully!",
      user
    });
  } catch (error) {
    console.error("User profile fetch failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};


