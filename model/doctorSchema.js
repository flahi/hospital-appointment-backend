<<<<<<< HEAD
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorName: { type: String },
  doctorId: { type: Number },
  specialization: { type: String },
  qualification: { type: String },
  password: { type: String },
  availability: { type: [String], default: [] }, // Array of available time slots
},{
    collection: "doctor"
});

module.exports = mongoose.model("doctorSchema", doctorSchema);
=======
const mongoose=require("mongoose");
const doctorSchema=new mongoose.Schema({
    "doctorName":{type:String},
    "doctorId":{type:Number},
    "specialization":{type:String},
    "qualification":{type:String}
},{
    collection:"doctor"
}
)
module.exports=mongoose.model("doctorSchema",doctorSchema);
