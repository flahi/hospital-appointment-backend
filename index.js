const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const appointmentRoute = require("./controller/appointmentRoute");
const reportRoute = require("./controller/reportRoute");
const patientRoute = require("./controller/patientRoute");
const doctorRoute = require("./controller/doctorRoute");
const testBookingRoute = require("./controller/testBookingRoute");
const patientOtpRoute = require("./controller/patientOtpRoute");
const { loginUser, authenticateUser } = require("./controller/authController");

// MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://admin:12345@cluster0.mmfpfzc.mongodb.net/Sunrise");
var db = mongoose.connection;
db.on("open", () => console.log("Connected to DB"));
db.on("error", () => console.log("An error has occurred"));

// Create the express app
const app = express();


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/appointment", appointmentRoute);
app.use("/report", reportRoute);
app.use("/patient", patientRoute);
app.use("/doctor", doctorRoute);
app.use("/testBooking", testBookingRoute);
app.use("/patientOtp", patientOtpRoute);

// Create a route for user login
app.post("/login", loginUser);

// Example: Protect an admin route
app.get("/admin/dashboard", authenticateUser, (req, res) => {
  if (req.user.role === "admin") {
    return res.status(200).json({ message: "Welcome, admin!" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});

// Example: Protect a doctor route
app.get("/doctor/dashboard", authenticateUser, (req, res) => {
  if (req.user.role === "doctor") {
    return res.status(200).json({ message: "Welcome, doctor!" });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
});

// Listening to port number
app.listen(4000, () => {
  console.log("Server started at 4000");
});
