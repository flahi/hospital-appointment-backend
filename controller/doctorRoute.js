
const express=require("express");
const doctorchema = require("../model/doctorSchema");
const doctorSchema = require("../model/doctorSchema");
const mongoose=require("mongoose")
const doctorRoute=express.Router();
studentRoute.post("/create-doctor")
studentRoute.get("/",(req,res)=>{
        studentschema.find((err,data)=>{
            if(err)
                return err;
            else
                res.json(data);
        }
        
        )
    })
doctorRoute.route("/update-doctor").get((req,res)=>{
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
studentRoute.delete("/delete-doctor/:id",(req,res)=>{
    studentSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err)
        return err;
    else
        res.json(data)
    })
})
module.exports=doctorRoute;