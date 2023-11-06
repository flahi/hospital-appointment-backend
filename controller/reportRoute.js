const express = require("express");
const reportSchema = require("../model/reportSchema");
const reportRoute = express.Router();

// POST endpoint to allow doctors to upload reports
//http://localhost:4000/report/upload
reportRoute.post("/upload", (req, res) => {
  try {
    const { name, patientId } = req.body;
    const pdfData = req.file.buffer; // Get the binary data from the uploaded file

    const newReport = new reportSchema({
      name,
      pdfData,
      patientId,
    });

    newReport.save((err, savedReport) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save the report to the database" });
      } else {
        res.status(201).json(savedReport);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload the report" });
  }
});

// GET endpoint to retrieve a specific report
//http://localhost:4000/report/download/:reportId
reportRoute.get("/download/:reportId", (req, res) => {
  const reportId = req.params.reportId;

  reportSchema.findById(reportId, (err, report) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve the report" });
    }

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.send(report.pdfData);
  });
});

module.exports = reportRoute;
