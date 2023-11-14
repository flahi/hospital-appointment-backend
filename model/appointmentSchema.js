const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    "appointmentDate":{type:Date},
    "appointmentId":{type :Number},
    "email":{type:String},
    "slot":{type:String},
    "doctorId":{type:Number},
    "reasonforappointment":{type:String}
},{
    collection:"appointment"
});

module.exports = mongoose.model("appointmentSchema", appointmentSchema);
