const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const moment = require("moment");
const testBookingSchema = require("../model/testBookingSchema");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:"sunrisehealthcareforyou@gmail.com",
      pass:"nrbzeuzcqwgjsusd"
  }
})

const testRoute = express.Router();

// http://localhost:4000/test/createTestAppointment
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
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            res.status(400).json({ error: "Email not sent" });
        } else {
            res.json(appointment);
        }
    });
  } catch (error) {
    console.error("Error creating test appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/test/checkAvailability
testRoute.get("/checkAvailability", async (req, res) => {
    const { testDate, slot } = req.query;
  
    try {
      if (!testDate || !slot) {
        return res.status(400).json({ error: "Invalid request. Missing parameters." });
      }
      const formattedTestDate = new Date(testDate);
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

// http://localhost:4000/test/getAllAppointments
testRoute.get("/getAllTestAppointments", async (req, res) => {
  try {
    const testAppointments = await testBookingSchema.find();
    res.json(testAppointments);
  } catch (error) {
    console.error("Error fetching test appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/test/getTestAppointments
testRoute.get("/getTestAppointments", async (req, res) => {
  const { email, option } = req.query;
  if (!email || !option) {
    return res.status(400).json({ error: "Please provide both email and option parameters" });
  }
  try {
    let tests;
    const today = new Date().toISOString().split('T')[0] + 'T00:00:00Z';
    if (option === "1") {
      tests = await testBookingSchema.find({ email: email, testDate: { $gte: today } });
    } else if (option === "2") {
      tests = await testBookingSchema.find({ email: email, testDate: { $lt: today } });
    } else {
      return res.status(400).json({ error: "Invalid option value" });
    }
    res.status(200).json(tests);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// http://localhost:4000/test/updateTestAppointment/:id
testRoute.put("/updateTestAppointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { testDate, slot } = req.body; // Ensure 'testDate' and 'slot' are correctly extracted from 'req.body'

    // Update the appointment with the provided 'id' using the received 'testDate' and 'slot'
    const updatedTestAppointment = await testBookingSchema.findByIdAndUpdate(
      id,
      { testDate, slot }, // Ensure to update the correct fields in the document
      { new: true }
    );

    res.json(updatedTestAppointment);
  } catch (error) {
    console.error("Error updating test appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// http://localhost:4000/test/deleteTestAppointment/:id
testRoute.delete("/deleteTestAppointment/:id", async (req, res) => {
  try {
    const test = await testBookingSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id));
    const { email, patientName, testDate, slot } = test;
    const formattedDate = moment(testDate).format('MMMM D, YYYY');
    const mailOptions = {
      from: "sunrisehealthcareforyou@gmail.com",
      to: email,
      subject: "Sunrise Healthcare - Testing Cancellation",
      html: `
          <html>
              <head>
                  <style>
                      body {
                          background-color: #f0f0f0; 
                      }
                  </style>
              </head>
              <body>
                  <p>Dear ${patientName},</p>
                  <p>Your test on ${formattedDate}, at ${slot} has been canceled.</p>
                  <p>We apologize for any inconvenience. If you have any concerns, please contact us.</p>
                  <p>Thank you for choosing Sunrise Healthcare.</p>
              </body>
          </html>
      `,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.error("Email not sent:", err);
      }
    });
    res.json(test);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = testRoute;
