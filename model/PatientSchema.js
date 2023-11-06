const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    "pid": { type: String },
    "firstname": { type: String },
    "lastname": { type: String },
    "emailid": { type: String },
    "phoneno": { type: Number },
    "Address": { type: String },
    "dob": { type: String },
}, {
    collection: "patients"
});

module.exports = mongoose.model("PatientSchema", PatientSchema);
