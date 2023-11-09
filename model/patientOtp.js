const mongoose = require("mongoose");
const validator = require("validator");

const patientOtpSchema = new mongoose.Schema({
    "email":{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error("Not valid email")
            }
        }
    },
    "otp":{
        type:String,
        required:true
    }
},{
    collection:"patientOtp"
});
module.exports = mongoose.model("patientOtp",patientOtpSchema);