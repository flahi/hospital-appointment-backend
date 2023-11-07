const mongoose=require("mongoose");
const doctorSchema=new mongoose.Schema({
    "doctorName":{type:String},
    "doctorId":{type:Number},
    "specialization":{type:String},
    "qualification":{type:String},
    "password":{type:String}
},{
    collection:"doctor"
}
)
module.exports=mongoose.model("doctorSchema",doctorSchema);
