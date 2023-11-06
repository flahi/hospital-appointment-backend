const express = require('express');
const patientRoute = express.Router();
const patientSchema = require("../model/patientSchema");
const mongoose = require('mongoose');

patientRoute.get("/",(req,res)=>{
    patientSchema.find((err,data)=>{
        if(err) return err;
        else res.json(data);
    })
})

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


patientRoute.route("/update-patient/:id")
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