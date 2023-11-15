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
    const doctors = await doctorSchema.find({ specialization: req.params.specialty }, "doctorName");
    res.json(doctors.map((doctor) => doctor.doctorName));
  } catch (error) {
    console.error("Error fetching doctors by specialty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/doctor/availability/:doctor/:date
doctorRoute.get("/availability/:doctor/:date", async (req, res) => {
  try {
    const doctor = await doctorSchema.findOne({ doctorName: req.params.doctor });
    // Assuming the doctor schema has an 'availability' field
    const availabilityData = {
      bookedSlots: doctor.availability?.[req.params.date]?.bookedSlots || [],
      availableSlots: doctor.availability?.[req.params.date]?.availableSlots || [],
    };
    res.json(availabilityData);
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
doctorRoute.get("/availability/:doctor/:date", async (req, res) => {
    try {
      const doctor = await doctorSchema.findOne({ doctorName: req.params.doctor });
      // Assuming the doctor schema has an 'availability' field
      const availabilityData = doctor.availability?.[req.params.date] || { bookedSlots: [], availableSlots: [] };
      res.json(availabilityData);
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = doctorRoute;
