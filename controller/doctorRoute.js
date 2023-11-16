// Backend doctor route
const express = require("express");
const doctorSchema = require("../model/doctorSchema");
const mongoose = require("mongoose");
const doctorRoute = express.Router();

// http://localhost:4000/doctor/createDoctor
doctorRoute.post("/createDoctor", (req, res) => {
  doctorSchema.create(req.body, (err, data) => {
    if (err) {
      return err;
    } else {
      res.json(data);
    }
  });
});

// http://localhost:4000/doctor
doctorRoute.get("/", (req, res) => {
  doctorSchema.find((err, data) => {
    if (err) {
      return err;
    } else {
      res.json(data);
    }
  });
});

// http://localhost:4000/doctor/updateDoctor
doctorRoute.route("/updateDoctor/:id").get((req, res) => {
  doctorSchema.find(mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return err;
    else res.json(data);
  });
}).put((req, res) => {
  doctorSchema.findByIdAndUpdate(
    mongoose.Types.ObjectId(req.params.id),
    { $set: req.body },
    (err, data) => {
      if (err) return err;
      else res.json(data);
    }
  );
});

// http://localhost:4000/doctor/deleteDoctor/:id
doctorRoute.delete("/deleteDoctor/:id", (req, res) => {
  doctorSchema.findByIdAndRemove(
    mongoose.Types.ObjectId(req.params.id),
    (err, data) => {
      if (err) return err;
      else res.json(data);
    }
  );
});

// http://localhost:4000/doctor/specialties
doctorRoute.get("/specialties", async (req, res) => {
  try {
    const specialties = await doctorSchema.distinct("specialization");
    res.json(specialties);
  } catch (error) {
    console.error("Error fetching specialties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/doctor/specialty/:specialty
doctorRoute.get("/specialty/:specialty", async (req, res) => {
  try {
    const doctors = await doctorSchema.find({ specialization: req.params.specialty });
    const doctorList = doctors.map((doctor) => ({
      doctorId: doctor.doctorId, // Assuming doctorSchema has an _id field
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
    }));
    res.json(doctorList);
  } catch (error) {
    console.error("Error fetching doctors by specialty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//http://localhost:4000/doctor/getDoctor
doctorRoute.get("/getDoctor", async (req, res) => {
  const {doctorId} = req.query;
  if (!doctorId) {
      return res.status(400).json({ error: "Please provide doctor id" });
  }
  try {
      const doctors = await doctorSchema.find({ doctorId:doctorId });
      if (doctors.length === 0) {
          return res.status(404).json({ error: "No doctors found with the provided doctor id" });
      }
      res.status(200).json(doctors);
  } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = doctorRoute;
