const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");

const testBookingSchema = require("../model/testBookingSchema");

const testRoute = express.Router();

// Endpoint to create a test appointment
testRoute.post("/createTestAppointment", async (req, res) => {
  try {
    const { email, patientName, testName, testDate, slot, dob, address } = req.body;
    const appointment = await testBookingSchema.create(req.body);

    const formattedDate = moment(appointment.testDate).format("MMMM D, YYYY");
    const mailOptions = {
      from: "sunrisehealthcareforyou@gmail.com",
      to: email,
      subject: "Sunrise Healthcare - Test Appointment Confirmation",
      html: `
          <html>
              <head>
                  <style>
                      body {
                          background-color: #f0f0f0; /* Set your desired background color */
                      }
                  </style>
              </head>
              <body>
                  <p>Dear ${patientName},</p>
                  <p>Your test appointment has been booked successfully!</p>
                  <h3>Appointment Details:</h3>
                  <p>Test Name: ${testName}</p>
                  <p>Date: ${formattedDate}</p>
                  <p>Slot: ${appointment.slot}</p>
                  <p>Thank you for choosing Sunrise Healthcare.</p>
              </body>
          </html>
      `,
    };
    console.log("Email sent:", mailOptions);
    // Sending confirmation email
    // Code for sending email goes here...

    res.json(appointment);
  } catch (error) {
    console.error("Error creating test appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to check test availability
testRoute.get("/checkAvailability", async (req, res) => {
    const { testDate, slot } = req.query;
  
    try {
      if (!testDate || !slot) {
        return res.status(400).json({ error: "Invalid request. Missing parameters." });
      }

      console.log("Received testDate:", testDate);
      console.log("Received slot:", slot);
  
      const formattedTestDate = new Date(testDate);
      console.log("Formatted testDate:", formattedTestDate);
      
      const existingTests = await testBookingSchema.findOne({
        testDate: formattedTestDate,
        slot,
      });
      
      console.log("Query Parameters:", { testDate: formattedTestDate, slot }); // Log query parameters

      console.log("Existing Tests:", existingTests);
      if (existingTests === null) {
        // Test slot is available
        return res.status(200).json({ available: true, message: "Slot available for booking" });
      } else {
        // Test slot is already booked
        return res.status(200).json({ available: false, message: "Slot not available for this test at this time" });
      }
    } catch (error) {
      console.error("Error checking test availability:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


// Endpoint to get all test appointments
testRoute.get("/getAllTestAppointments", async (req, res) => {
  try {
    const testAppointments = await testBookingSchema.find();
    res.json(testAppointments);
  } catch (error) {
    console.error("Error fetching test appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to update a test appointment
testRoute.put("/updateTestAppointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTestAppointment = await testBookingSchema.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTestAppointment);
  } catch (error) {
    console.error("Error updating test appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to delete a test appointment
testRoute.delete("/deleteTestAppointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTestAppointment = await testBookingSchema.findByIdAndDelete(id);
    res.json(deletedTestAppointment);
  } catch (error) {
    console.error("Error deleting test appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = testRoute;
