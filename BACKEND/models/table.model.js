var mongoose = require("mongoose");

const reservationSchema = require("./reservation.model").schema;

var tableSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  isAvailable: Boolean,
  location: String,
  reservation: {
    required: false,
    type: reservationSchema
  }
});

module.exports = mongoose.model('tables', tableSchema)