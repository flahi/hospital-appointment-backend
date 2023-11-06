const mongoose=require("mongoose");
const doctorSchema=new mongoose.Schema({
    "name":{type:String},
    "specialization":{type:String},
    "qualification":{type:String},
    "password":{type:String}
},{
    collection:"doctors"
}
)
module.exports=mongoose.model("doctorschema",doctorSchema);
