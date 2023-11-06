const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pdfData: { type: Buffer, required: true },
    patientId: { type: String, required: true },
  },
  {
    collection: "report",
  }
);

module.exports = mongoose.model("Report", reportSchema);
