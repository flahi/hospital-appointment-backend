const mongoose = require("mongoose");

const testBookingSchema = new mongoose.Schema(
  {
    testName: { type: String },
    testType: { type: String },
    patientName: { type: String },
    patientAge: { type: Number },
    patientGender: { type: String, enum: ["Male", "Female", "Other"] },
    testDate: { type: Date },
    doctorName: { type: String },
    labName: { type: String },
    results: { type: String },
    isCompleted: { type: Boolean },
  },
  {
    collection: "test",
  }
);

module.exports = mongoose.model("testBookingSchema", testBookingSchema);
