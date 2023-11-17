const express = require("express");
const appointmentSchema = require("../model/appointmentSchema");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const moment = require('moment');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sunrisehealthcareforyou@gmail.com",
        pass:"nrbzeuzcqwgjsusd"
    }
})

const appointmentRoute = express.Router();

// http://localhost:4000/appointment/createAppointment
appointmentRoute.post("/createAppointment", async (req, res) => {
  try {
      const { email, patientName } = req.body;

      const appointment = await appointmentSchema.create(req.body);

      // Format the date to show only the date without the time
      const formattedDate = moment(appointment.appointmentDate).format('MMMM D, YYYY');

      const mailOptions = {
          from: "sunrisehealthcareforyou@gmail.com",
          to: email,
          subject: "Sunrise Healthcare - Appointment Confirmation",
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
                      <p>Your appointment has been booked successfully!</p>
                      <h3>Appointment Details:</h3>
                      <p>Date: ${formattedDate}</p>
                      <p>Slot: ${appointment.slot}</p>
                      <p>Reason for Appointment: ${appointment.reasonforappointment}</p>
                      <p>Thank you for choosing Sunrise Healthcare.</p>
                  </body>
              </html>
          `,
      };

      transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
              res.status(400).json({ error: "Email not sent" });
          } else {
              console.log("Email sent");
              res.json(appointment);
          }
      });
  } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment/checkAvailability
appointmentRoute.get("/checkAvailability", async (req, res) => {
  const { doctorId, appointmentDate, slot } = req.query;

  try {
    const existingAppointments = await appointmentSchema.find({
      doctorId: doctorId,
      appointmentDate: appointmentDate,
      slot: slot,
    });

    if (existingAppointments && existingAppointments.length > 0) {
      // Appointment slot is already booked
      res.status(200).json({ available: false, message: "Slot not available for this doctor at this time" });
    } else {
      // Appointment slot is available
      res.status(200).json({ available: true, message: "Slot available for booking" });
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment/getAppointment
appointmentRoute.get("/getAppointment", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Please provide an email" });
  }
  try {
    const appointments = await appointmentSchema.find({ email: email });
    if (appointments.length === 0) {
      return res.status(404).json({ error: "No appointment found with the provided email" });
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment
appointmentRoute.get("/", async (req, res) => {
  try {
    const appointments = await appointmentSchema.find();
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment/updateAppointment/:id
appointmentRoute.route("/updateAppointment/:id")
  .get(async (req, res) => {
    try {
      const appointment = await appointmentSchema.findById(mongoose.Types.ObjectId(req.params.id));
      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .put(async (req, res) => {
    try {
      const appointment = await appointmentSchema.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.params.id),
        { $set: req.body },
        { new: true }
      );
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// http://localhost:4000/appointment/deleteAppointment/:id
appointmentRoute.delete("/deleteAppointment/:id", async (req, res) => {
  try {
    const appointment = await appointmentSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id));
    res.json(appointment);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = appointmentRoute;