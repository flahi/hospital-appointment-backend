const mongoose = require("mongoose");

const testBookingSchema = new mongoose.Schema(
  {
    testName: { type: String },
    testType: { type: String },
    patientName: { type: String },
    patientId: { type: Number },
    testDate: { type: Date },
    doctorId: { type: Number },
    results: { type: String },
    isCompleted: { type: Boolean },
  },
  {
    collection: "test",
  }
);

module.exports = mongoose.model("testBookingSchema", testBookingSchema);
