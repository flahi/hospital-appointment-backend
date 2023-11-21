// Backend doctor route
const express = require("express");
const doctorSchema = require("../model/doctorSchema");
const mongoose = require("mongoose");
const doctorRoute = express.Router();
const { changeDoctorPassword } = require("../controller/authController");
const User = require("../model/userModel");
const bcrypt = require('bcrypt');

// http://localhost:4000/doctor/createDoctor
doctorRoute.post("/createDoctor", async (req, res) => {
  try {
    const { doctorId, doctorName, specialization, qualification, password } = req.body;

    // Create a doctor in the doctorSchema
    const newDoctor = await doctorSchema.create({
      doctorId,
      doctorName,
      specialization,
      qualification,
    });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const createdUser = await User.create({
      empId: doctorId,
      password: hashedPassword,
      role: "doctor",
    });


    res.status(201).json(newDoctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

doctorRoute.delete('/deleteDoctor/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the doctor by ID and delete
    const deletedDoctor = await doctorSchema.findByIdAndRemove(id);

    // Delete the corresponding user from the users collection based on empId
    if (deletedDoctor) {
      await User.deleteOne({ empId: deletedDoctor.doctorId });
      res.json(deletedDoctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
        return res.status(400).json({ error: "Please provide doctor ID" });
    }
    try {
        const doctors = await doctorSchema.find({ doctorId: doctorId });
        if (doctors.length === 0) {
            return res.status(404).json({ error: "No doctor found with the provided doctor id" });
        }
        res.status(200).json(doctors);
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// http://localhost:4000/doctor/getAllDoctors
doctorRoute.get("/getAllDoctors", async (req, res) => {
    try {
        const doctors = await doctorSchema.find();
        res.status(200).json(doctors);
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//http://localhost:4000/doctor
doctorRoute.get("/",(req,res)=>{
    doctorSchema.find((err,data)=>{
        if(err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})

// http://localhost:4000/doctor/updateDoctor/:id
doctorRoute.put("/updateDoctor/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedDoctor = req.body;
  
      const doctor = await doctorSchema.findByIdAndUpdate(
        id,
        { $set: updatedDoctor },
        { new: true }
      );
  
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      res.status(200).json(doctor);
    } catch (error) {
      console.error("Error updating doctor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

//http://localhost:4000/doctor/deleteDoctor/:id
doctorRoute.delete("/deleteDoctor/:id",(req,res)=>{
    doctorSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err)
        return err;
    else
        res.json(data)
    })
})

// http://localhost:4000/doctordashboard/myappointments
doctorRoute.get('/myappointments', async (req, res) => {
  const { doctorId, startDate, endDate } = req.query;

  try {
    // Fetch appointments for the doctor within the specified date range
    const appointments = await appointmentSchema.find({
      doctorId: doctorId,
      appointmentDate: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// http://localhost:4000/doctordashboard/cancelappointment/:id
doctorRoute.delete('/cancelappointment/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    // Delete the appointment by ID
    const canceledAppointment = await appointmentSchema.findByIdAndDelete(appointmentId);

    if (canceledAppointment) {
      // Send a response indicating successful cancellation
      res.status(200).json({ message: 'Appointment canceled successfully' });
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to change password for doctors
doctorRoute.post("/changePassword", changeDoctorPassword);

module.exports=doctorRoute;