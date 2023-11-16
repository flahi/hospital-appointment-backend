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
module.exports=doctorRoute;