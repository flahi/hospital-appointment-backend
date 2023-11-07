const express=require("express");
const doctorSchema = require("../model/doctorSchema");
const mongoose=require("mongoose")
const doctorRoute=express.Router();

//http://localhost:4000/doctor/createDoctor
doctorRoute.post("/createDoctor",(req, res)=>{
    doctorSchema.create(req.body,(err,data)=>{
        if (err) {
            return err;
        }
        else {
            res.json(data);
        }
    })
})

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

//http://localhost:4000/doctor/updateDoctor
doctorRoute.route("/updateDoctor/:id").get((req,res)=>{
doctorSchema.find(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
    if(err)
        return err;
    else
        res.json(data)
})
}).put((req,res)=>{
    doctorSchema.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id),{$set: req.body},(err,data)=>{
        if(err)
        return err;
    else
        res.json(data)
    })
})

//http://localhost:4000/doctor/deleteDoctor/:id
doctorRoute.delete("/deleteDoctor/:id",(req,res)=>{
    doctorSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err)
        return err;
    else
        res.json(data)
    })
})
module.exports=doctorRoute;