const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({

    Rating:{
        type: Number,
        required: true,
        trim:true,
    },
    Comment:{
        type: String,
        required: true,
        trim:true,
    },
})
const FeedbackModel = mongoose.model('feedback',feedbackSchema);
module.exports = FeedbackModel; 
