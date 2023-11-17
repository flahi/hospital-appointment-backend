const mongoose = require("mongoose");

const testBookingSchema = new mongoose.Schema(
  {
    "testName": { type: String },
    "email": { type: String },
    "testDate": { type: Date },
    "slot": { type:String },
    "dob": { type:Date },
    "patientName": { type:String },
    "address": { type:String }
  },
  {
    collection: "test",
  }
);

module.exports = mongoose.model("testBookingSchema", testBookingSchema);
