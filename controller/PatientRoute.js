const express = require('express');
const PatientRoute = express.Router();
const PatientScehma = require("../model/PatientSchema");
const mongoose = require('mongoose');

PatientRoute.get("/",(req,res)=>{
    PatientScehma.find((err,data)=>{
        if(err) return err;
        else res.json(data);
    })
})

PatientRoute.post("/createPatient",(req, res)=>{
    PatientSchema.create(req.body,(err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})


PatientRoute.route("/update-patient/:id")
.get((req,res)=>{
    PatientScehma.find(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
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


PatientRoute.delete("/deletePatient/:id",(req,res)=>{
    PatientSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err, data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})


module.exports=PatientRoute;