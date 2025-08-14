const mongoose = require("mongoose");
// const initAdmin = require("../utils/defaultAdmin"); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Not connected:", error.message);
  }
};

module.exports = connectDB;
