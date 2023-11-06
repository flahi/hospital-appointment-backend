const express = require("express");
const mongoose = require("mongoose");
const testBooking = require("../model/testBookingSchema");
const testBookingRoute = express.Router();

testBookingRoute.post("/create-test-booking", (req, res) => {
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

testBookingRoute.get("/", (req, res) => {
  testBooking.find((err, data) => {
    if (err) {
      return err;
    } else {
      res.json(data);
    }
  });
});

testBookingRoute
  .route("/update-test-booking/:id")
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

testBookingRoute.delete("/delete-test-booking/:id", (req, res) => {
  testBooking.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete test booking." });
    } else {
      res.json(data);
    }
  });
});

module.exports = testBookingRoute;
