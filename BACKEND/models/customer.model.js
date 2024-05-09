const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    customerFullName:{

        type: String,
        required: true,
        trim: true,
    },

    customerEmail:{
        type: String,
        required: true,
        trim: true,
    },

    customerContactNo:{
        type: Number,
        required: true,
        trim : true,

    },

    customerNIC:{
        type: String,
        required: true,
        trim: true,
    },

    customerGender:{
        type: String,
        required: true,
        trim: true,
    },

    customerAddress:{
        type: String,
        required: true,
        trim: true,
    },

    customerLoyaltyPoints:{
        type: String,
        required: true,
        trim: true,
    },

    feedbacks: {
        type: [
            {
                DayVisited: {
                    type: String,
                },

                TimeVisited: {
                    type: String,   
                },

                Comment: {
                    type: String, 
                },
                rating:{
                    type: Number,
                
                },
                  reply: {
                    type: String,
                    default: "pending"
                  }
                
            },
        ],
        default: []
    }

    
})

const customerModel = mongoose.model('customers',customerSchema)
module.exports = customerModel;