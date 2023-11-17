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

testBookingSchema.index({ testDate: 1, slot: 1 });

module.exports = mongoose.model("testBookingSchema", testBookingSchema);
