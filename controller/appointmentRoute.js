const express = require("express");
const appointmentSchema = require("../model/appointmentSchema");
const mongoose = require("mongoose");

const appointmentRoute = express.Router();

//http://localhost:4000/appointment/createAppointment
appointmentRoute.post("/createAppointment",(req, res)=>{
    appointmentSchema.create(req.body,(err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})
//http://localhost:4000/appointment/getAppointment
appointmentRoute.get("/getAppointment", async (req, res) => {
    const {email} = req.query;
    if (!email) {
        return res.status(400).json({ error: "Please provide an email" });
    }
    try {
        const appointments = await appointmentSchema.find({ email: email });
        if (appointments.length === 0) {
            return res.status(404).json({ error: "No appointment found with the provided email" });
        }
        res.status(200).json(appointments);
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//http://localhost:4000/appointment
appointmentRoute.get("/",(req, res)=>{
    appointmentSchema.find((err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})

//http://localhost:4000/appointment/updateAppointment/:id
appointmentRoute.route("/updateAppointment/:id")
.get((req,res)=>{
    appointmentSchema.findById(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})
.put((req, res)=>{
    appointmentSchema.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id),
    {$set:req.body},
    (err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})

//http://localhost:4000/appointment/deleteAppointment/:id
appointmentRoute.delete("/deleteAppointment/:id",(req,res)=>{
    appointmentSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err, data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})
module.exports = appointmentRoute;