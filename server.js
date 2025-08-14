const express = require("express");
const connectDB = require("./config/db");
const UserRouter = require("./routes/userRoutes");







const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", UserRouter);



connectDB();



app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
