const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    "appointmentDate":{type:Date},
    "patientName":{type:String},
    "email":{type:String},
    "slot":{type:String},
    "doctorId":{type:Number},
    "reasonforappointment":{type:String}
},{
    collection:"appointment"
});

module.exports = mongoose.model("appointmentSchema", appointmentSchema);
