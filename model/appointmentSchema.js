const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    "appointmentDate":{type:Date},
    "patientName":{type:String},
    "email":{type:String},
    "slot":{type:String},
    "doctorId":{type:Number},
    "reasonforappointment":{type:String},
    "isCompleted":{type:Boolean},
    "isChanged":{type:Boolean}
},{
    collection:"appointment"
});

module.exports = mongoose.model("appointmentSchema", appointmentSchema);
