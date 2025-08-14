const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/AdminDb");

async function createDefaultAdmin() {
  // Update the connection string if your DB is not local or has a different name
  await mongoose.connect("mongodb://localhost:27017/your_db_name");

  const existing = await Admin.findOne({ username: "admin" });
  if (existing) {
    console.log("Default admin already exists.");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new Admin({
    username: "admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
    isActive: true,
    moduleAccess: ["user_management", "product_management", "order_management"]
  });

  await admin.save();
  console.log("Default admin created! Username: admin, Password: admin123");
  process.exit();
}

createDefaultAdmin();