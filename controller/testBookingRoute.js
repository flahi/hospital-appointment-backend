const express = require("express");
const mongoose = require("mongoose");
const testBooking = require("../model/testBookingSchema");
const testBookingRoute = express.Router();

//http://localhost:4000/testBooking/cTestBooking
testBookingRoute.post("/cTestBooking", (req, res) => {
  const {
    testName,
    testType,
    patientName,
    patientAge,
    patientGender,
    testDate,
    doctorName,
    labName,
    results,
    isCompleted,
  } = req.body;
  testBooking.create(
    {
      testName,
      testType,
      patientName,
      patientAge,
      patientGender,
      testDate,
      doctorName,
      labName,
      results,
      isCompleted,
    },
    (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to create test booking." });
      } else {
        res.json(data);
      }
    }
  );
});

//http://localhost:4000/testBooking
testBookingRoute.get("/", (req, res) => {
  testBooking.find((err, data) => {
    if (err) {
      return err;
    } else {
      res.json(data);
    }
  });
});

//http://localhost:4000/testBooking/updateTestBooking/:id
testBookingRoute
  .route("/updateTestBooking/:id")
  .get((req, res) => {
    testBooking.findById(req.params.id, (err, data) => {
      if (err) {
        return err;
      } else {
        res.json(data);
      }
    });
  })
  .put((req, res) => {
    TestBooking.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
      (err, data) => {
        if (err) {
          return err;
        } else {
          res.json(data);
        }
      }
    );
  });

//http://localhost:4000/testBooking/deleteTestBooking/:id
testBookingRoute.delete("/deleteTestBooking/:id", (req, res) => {
  testBooking.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete test booking." });
    } else {
      res.json(data);
    }
  });
});

module.exports = testBookingRoute;
