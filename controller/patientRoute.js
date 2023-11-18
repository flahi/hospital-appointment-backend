const express = require('express');
const patientRoute = express.Router();
const patientSchema = require("../model/patientSchema");
const mongoose = require('mongoose');

//http://localhost:4000/patient
patientRoute.get("/",(req,res)=>{
    patientSchema.find((err,data)=>{
        if(err) return err;
        else res.json(data);
    })
})

//http://localhost:4000/patient/getPatient
patientRoute.get("/getPatient", async (req, res) => {
    const { email, patientName } = req.query;

    try {
        let query = {};

        if (email) {
            query.email = email;
        }

        if (patientName) {
            query.patientName = { $regex: new RegExp(patientName, 'i') };
        }

        const patients = await patientSchema.find(query);

        if (patients.length === 0) {
            return res.status(200).json({ message: "No patient found with the provided criteria" });
        }

        res.status(200).json(patients);
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// http://localhost:4000/patient/getAllPatients
patientRoute.get("/getAllPatients", async (req, res) => {
    try {
        const patients = await patientSchema.find();
        res.status(200).json(patients);
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//http://localhost:4000/patient/createPatient
patientRoute.post("/createPatient", async (req, res) => {
    const { email, patientName } = req.body;
    try {
      const existingPatient = await patientSchema.findOne({ email, patientName });
      if (existingPatient) {
        return res.status(200).json({ message: "Patient already exists" });
      }
      const patient = await patientSchema.create(req.body);
      res.status(200).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

//http://localhost:4000/patient/updatePatient/:id
patientRoute.route("/updatePatient/:id")
.get((req,res)=>{
    PatientSchema.find(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err) return err;
        else res.json(data);
    })
})
.put((req,res)=>{
    PatientSchema.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id),
    {$set:req.body},
    (err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
});

//http://localhost:4000/patient/deletePatient/:id
patientRoute.delete("/deletePatient/:id",(req,res)=>{
    patientSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err, data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})


module.exports=patientRoute;