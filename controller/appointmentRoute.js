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

// http://localhost:4000/appointment/getAppointmentForDoctorToday
appointmentRoute.get('/getAppointmentForDoctorToday', async (req, res) => {
  const { doctorId } = req.query;
  if (!doctorId) {
    return res.status(400).json({ error: 'Please provide doctor ID' });
  }
  
  try {
    const currentDate = new Date().toISOString().split('T')[0] + 'T00:00:00Z'; // Set time to midnight
    const appointments = await appointmentSchema.find({
      doctorId: doctorId,
      appointmentDate: currentDate,
      isCompleted: false
    });
    
    if (appointments.length === 0) {
      return res.status(200).json({ message: 'No appointments found for the day' });
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.log('error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
// http://localhost:4000/appointment/sendDiagnosis/:id
appointmentRoute.post('/sendDiagnosis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const appointment = await appointmentSchema.findById(mongoose.Types.ObjectId(id));
    
    const { email: patientEmail, patientName, appointmentDate, slot } = appointment;
    const formattedDate = moment(appointmentDate).format('MMMM D, YYYY');

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: patientEmail,
      subject: 'Diagnosis and Appointment Summary',
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
                  <p>Thank you for choosing Sunrise Healthcare.</p>
                  <p>Your appointment on ${formattedDate}, at ${slot} has concluded.</p>
                  <p>Diagnosis Message: ${message}</p>
                  <p>We appreciate your trust in our services. If you have any further questions or concerns, please feel free to contact us.</p>
                  <p>Best regards,</p>
                  <p>Sunrise Healthcare Team</p>
              </body>
          </html>
      `,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.error("Email not sent:", err);
      }
    });
    res.status(200).json({ message: 'Diagnosis and Appointment Summary sent successfully' });
  } catch (error) {
    console.error('Error sending diagnosis and appointment summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// http://localhost:4000/appointment/deleteAppointment/:id
appointmentRoute.delete("/deleteAppointment/:id", async (req, res) => {
  try {
    const appointment = await appointmentSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id));
    const { email, patientName, appointmentDate, slot } = appointment;
    const formattedDate = moment(appointmentDate).format('MMMM D, YYYY');
    const mailOptions = {
      from: "sunrisehealthcareforyou@gmail.com",
      to: email,
      subject: "Sunrise Healthcare - Appointment Cancellation",
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
                  <p>Your appointment on ${formattedDate}, at ${slot} has been canceled.</p>
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
    res.json(appointment);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment/completeAppointment/:id
appointmentRoute.put('/completeAppointment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await appointmentSchema.findByIdAndUpdate(
      id,
      { $set: { isCompleted: true } },
      { new: true }
    );

    if (appointment) {
      res.status(200).json({ success: true, message: 'Appointment marked as completed' });
    } else {
      res.status(404).json({ success: false, message: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = appointmentRoute;