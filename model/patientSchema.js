const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const SECRET_KEY = "abcdemern";

const patientSchema = new mongoose.Schema({
    "patientName": { type: String },
    "email": { type: String, required:true},
    "phoneNo": { type: String},
    "address": { type: String },
    "dob": { type: Date },
    "tokens":[
        {
            "token":{
                type:"String",
                required:true
            }
        }
    ]
}, {
    collection: "patient"
});

patientSchema.methods.generateAuthtoken = async function(res){
    try {
        let newtoken = jwt.sign({_id:this._id},SECRET_KEY,{
            expiresIn:"1d"
        });
        this.tokens = this.tokens.concat({token:newtoken});
        await this.save();
        return newtoken;
    }
    catch (err) {
        res.status(400).json(err);
    }
}

module.exports = mongoose.model("patientSchema", patientSchema);
