const mongoose = require("mongoose")

const staffSchema = new mongoose.Schema({
    staffName:{
        type:String,
        required: true,
        trim: true,
    },
    staffEmail: {
        type:String,
        required:true,
        trim:true,
    },
    staffContactNo:{
        type:String,
        required:true,
        trim:true,
    },
    staffAddress:{
        type:String,
        required:true,
        trim:true,
    },
    staffAge:{
        type:Number,
        required:true,
        trim:true,
    },
    staffGender:{
        type:String,
        required:true,
        trim:true,
    },
    staffSalaryPerHours:{
        type:Number,
        required:true,
        trim:true,
    },
    staffWorkedHours:{
        type:Number,
        required:true,
        trim:true,
    },
    staffRole:{
        type:String,
        enum:['admin','chef','cashier'],
        default:'admin'
    },
    staffPassword:{
        type: String,
        required: true
    }

});

const  staffModel=mongoose.model('staff',staffSchema);
module.exports=staffModel;