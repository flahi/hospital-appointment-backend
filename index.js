const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const appointmentRoute = require("./controller/appointmentRoute");
const reportRoute = require("./controller/reportRoute");
const patientRoute = require("./controller/patientRoute");


//MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://admin:12345@cluster0.mmfpfzc.mongodb.net/Sunrise");
var db = mongoose.connection;
db.on("open",()=>console.log("Connected to DB"));
db.on("error",()=>console.log("An error has occured"));

//Create the express app
const app = express();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use("/appointment",appointmentRoute);
app.use("/report",reportRoute);
app.use("/patient",patientRoute);

//Listening to port number
app.listen(4000,()=>{
    console.log("Server started at 4000");
})