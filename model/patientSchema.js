const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    "patientId": { type: Number },
    "patientName": { type: String },
    "email": { type: String },
    "phoneNo": { type: String},
    "address": { type: String },
    "dob": { type: Date },
}, {
    collection: "patient"
});

module.exports = mongoose.model("patientSchema", patientSchema);
