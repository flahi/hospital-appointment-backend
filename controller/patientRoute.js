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
    const {email, patientName} = req.query;
    if (!email||!patientName) {
        return res.status(400).json({ error: "Please provide an email or name" });
    }
    try {
        const patients = await patientSchema.find({ email: email, patientName:patientName });
        if (patients.length === 0) {
            return res.status(404).json({ error: "No patient found with the provided email and name" });
        }
        res.status(200).json(patients);
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//http://localhost:4000/patient/createPatient
patientRoute.post("/createPatient",(req, res)=>{
    patientSchema.create(req.body,(err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})

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