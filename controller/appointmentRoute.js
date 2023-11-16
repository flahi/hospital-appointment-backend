const express = require("express");
const appointmentSchema = require("../model/appointmentSchema");
const mongoose = require("mongoose");

const appointmentRoute = express.Router();

// http://localhost:4000/appointment/createAppointment
appointmentRoute.post("/createAppointment", async (req, res) => {
  try {
    const appointment = await appointmentSchema.create(req.body);
    res.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment/checkAvailability
appointmentRoute.get("/checkAvailability", async(req, res) => {})

// http://localhost:4000/appointment/getAppointment
appointmentRoute.get("/getAppointment", async (req, res) => {
  const { email } = req.query;
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

// http://localhost:4000/appointment
appointmentRoute.get("/", async (req, res) => {
  try {
    const appointments = await appointmentSchema.find();
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment/updateAppointment/:id
appointmentRoute.route("/updateAppointment/:id")
  .get(async (req, res) => {
    try {
      const appointment = await appointmentSchema.findById(mongoose.Types.ObjectId(req.params.id));
      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .put(async (req, res) => {
    try {
      const appointment = await appointmentSchema.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.params.id),
        { $set: req.body },
        { new: true }
      );
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// http://localhost:4000/appointment/deleteAppointment/:id
appointmentRoute.delete("/deleteAppointment/:id", async (req, res) => {
  try {
    const appointment = await appointmentSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id));
    res.json(appointment);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = appointmentRoute;