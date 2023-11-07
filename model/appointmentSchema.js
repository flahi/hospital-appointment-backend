const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    "appointmentDate":{type:Date},
    "appointmentId":{type :Number},
    "slot":{type:Number},
    "patientId":{type:Number},
    "doctorId":{type:Number}
},{
    collection:"appointment"
});

module.exports = mongoose.model("appointmentSchema", appointmentSchema);
