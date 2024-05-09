var mongoose = require("mongoose");

var reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String
});

module.exports = mongoose.model('reservations', reservationSchema)
