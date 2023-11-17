const express = require("express");
const patientOtpSchema = require("../model/patientOtp");
const patientSchema = require("../model/patientSchema");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sunrisehealthcareforyou@gmail.com",
        pass:"nrbzeuzcqwgjsusd"
    }
})

const patientOtpRoute = express.Router();

// http://localhost:4000/patientOtp/appointment/sendOtp
patientOtpRoute.post("/appointment/sendOtp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Please enter your email" });
  }
  try {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const existEmail = await patientOtpSchema.findOne({ email: email });
    if (existEmail) {
      const updateData = await patientOtpSchema.findByIdAndUpdate(
        { _id: existEmail._id },
        {
          otp: OTP,
        },
        { new: true }
      );
      await updateData.save();
    } else {
      const saveData = new patientOtpSchema({
        email,
        otp: OTP,
      });
      await saveData.save();
    }

    const mailOptions = {
      from: "sunrisehealthcareforyou@gmail.com",
      to: email,
      subject: "Sunrise Healthcare - Patient OTP",
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
          <p>Dear Patient,</p>
          <p>Your OTP for Sunrise Healthcare is:</p>
          <h1 style="font-size: 24px; color: #007bff;">${OTP}</h1>
          <p>Thank you for using our service.</p>
        </body>
      </html>
      `,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        res.status(400).json({ error: "Email not sent" });
      } else {
        console.log("Email sent");
        res.status(200).json("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid details" });
  }
});

//http://localhost:4000/patientOtp/sendOtp
patientOtpRoute.post("/sendOtp", async(req, res)=>{
    const {email} = req.body;
    if (!email) {
        res.status(400).json({error:"Please enter your email"});
    }
    try {
        const preuser = await patientSchema.findOne({"email":email});
        if (preuser) {
            const OTP = Math.floor(100000+Math.random()*900000);
            const existEmail = await patientOtpSchema.findOne({email:email});
            if (existEmail) {
                const updateData = await patientOtpSchema.findByIdAndUpdate({_id:existEmail._id},{
                    otp:OTP
                },{new:true});
                await updateData.save();
                const mailOptions = {
                    from: "sunrisehealthcareforyou@gmail.com",
                    to: email,
                    subject: "Sunrise Healthcare - Patient OTP",
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
                          <p>Dear Patient,</p>
                          <p>Your OTP for Sunrise Healthcare is:</p>
                          <h1 style="font-size: 24px; color: #007bff;">${OTP}</h1>
                          <p>Thank you for using our service.</p>
                        </body>
                      </html>
                    `
                  };
                transporter.sendMail(mailOptions,(err,data)=>{
                    if (err) {
                        res.status(400).json({error:"Email not sent"});
                    }
                    else {
                        res.status(200).json("Email sent successfully");
                    }
                })
            }
            else {
                const saveData = new patientOtpSchema({
                    email, otp:OTP
                });
                await saveData.save();
                const mailOptions = {
                    from: "sunrisehealthcareforyou@gmail.com",
                    to: email,
                    subject: "Sunrise Healthcare - Patient OTP",
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
                          <p>Dear Patient,</p>
                          <p>Your OTP for Sunrise Healthcare is:</p>
                          <h1 style="font-size: 24px; color: #007bff;">${OTP}</h1>
                          <p>Thank you for using our service.</p>
                        </body>
                      </html>
                    `
                  };
                  
                transporter.sendMail(mailOptions,(err,data)=>{
                    if (err) {
                        res.status(400).json({error:"Email not sent"});
                    }
                    else {
                        console.log("Email sent");
                        res.status(200).json("Email sent successfully");
                    }
                })
            }
        }
        else {
            res.status(400).json({error:"This patient does not exist in db", "messageByFaimu":preuser});
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({error:"Invalid details"});
    }
})

//http://localhost:4000/patientOtp/status
patientOtpRoute.post("/status",async(req, res)=>{
    const {email, otp, option} = req.body;
    var message = "Appointment scheduled successfully";
    if (!otp||!email) {
        res.status(400).json({error:"Please enter otp"});
    }
    try {
        const otpVerification = await patientOtpSchema.findOne({email:email});
        if (otpVerification.otp===otp){
          var token = 123;
          if (option==="1") {
            const preuser = await patientSchema.findOne({email:email});
            token = await preuser.generateAuthtoken(res);
            message = "Patient login success";
          }
            res.status(200).json({message:message, userToken:token});
        }
        else {
            res.status(400).json({error:"Invalid Otp"});
        }
    }
    catch (err) {
        console.log("error:",err);
        res.status(400).json({error:"Invalid details"});
    }
});


module.exports = patientOtpRoute;