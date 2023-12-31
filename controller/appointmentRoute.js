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
      const { email, patientName, doctorName } = req.body;
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
                              background-color: #f0f0f0;
                          }
                      </style>
                  </head>
                  <body>
                      <p>Dear ${patientName},</p>
                      <p>Your appointment has been booked successfully!</p>
                      <h3>Appointment Details:</h3>
                      <p>Doctor: ${doctorName}</p>
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
    if (!doctorId || !appointmentDate || !slot) {
      return res.status(400).json({ error: "Invalid request. Missing parameters." });
    }

    const formattedAppointmentDate = new Date(appointmentDate);
    const existingAppointments = await appointmentSchema.findOne({
      doctorId: doctorId,
      appointmentDate: formattedAppointmentDate,
      slot,
    });

    if (existingAppointments === null) {
      // Appointment slot is available
      return res.status(200).json({ available: true, message: "Slot available for booking" });
    } else {
      // Appointment slot is already booked
      return res.status(200).json({ available: false, message: "Slot not available for this appointment at this time" });
    }
  } catch (error) {
    console.error("Error checking appointment availability:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:4000/appointment/getAppointment
appointmentRoute.get("/getAppointment", async (req, res) => {
  const { email, isCompleted } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Please provide an email" });
  }
  try {
    const appointments = await appointmentSchema.find({ email: email, isCompleted:isCompleted });
    res.status(200).json(appointments);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

appointmentRoute.get('/getAppointmentForDoctorByDate/:doctorId/:date', async (req, res) => {
  const { doctorId, date } = req.params;
  try {
    // Assuming appointmentSchema represents your Mongoose model
    const appointments = await appointmentSchema.find({
      doctorId: doctorId,
      appointmentDate: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) }, // Fetch appointments for the specified date
    });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
appointmentRoute.put("/updateAppointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { appointmentDate, slot } = req.body; // Ensure 'appointmentDate' and 'slot' are correctly extracted from 'req.body'

    // Update the appointment with the provided 'id' using the received 'appointmentDate' and 'slot'
    const updatedAppointment = await appointmentSchema.findByIdAndUpdate(
      id,
      { appointmentDate, slot }, // Ensure to update the correct fields in the document
      { new: true }
    );

    res.json(updatedAppointment);
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
                          background-color: #f0f0f0; 
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
// Update the existing route to handle fetching appointments for a specific date
appointmentRoute.get('/getAppointmentForDoctorByDate', async (req, res) => {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) {
    return res.status(400).json({ error: 'Please provide doctor ID and date' });
  }

  try {
    const appointments = await appointmentSchema.find({
      doctorId: doctorId,
      appointmentDate: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) },
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments by date:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// http://localhost:4000/appointment/getAppointmentForDoctorByDateAndPatient
appointmentRoute.get('/getAppointmentForDoctorByDateAndPatient', async (req, res) => {
  const { doctorId, date, patientName } = req.query;

  if (!doctorId || !date || !patientName) {
    return res.status(400).json({ error: 'Please provide doctor ID, date, and patient name' });
  }

  try {
    const appointments = await appointmentSchema.find({
      doctorId: doctorId,
      appointmentDate: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      },
      patientName: { $regex: new RegExp(patientName, 'i') }, // Case-insensitive search
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments by date and patient name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// http://localhost:4000/appointment/getAppointmentForDoctorByPatientName
appointmentRoute.get('/getAppointmentForDoctorByPatientName', async (req, res) => {
  const { doctorId, patientName } = req.query;

  if (!doctorId && !patientName) {
    return res.status(400).json({ error: 'Please provide doctor ID and patient name' });
  }

  try {
    const appointments = await appointmentSchema.find({
      doctorId: doctorId,
      patientName: { $regex: new RegExp(patientName, 'i') }, // Case-insensitive search
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments by patient name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = appointmentRoute;