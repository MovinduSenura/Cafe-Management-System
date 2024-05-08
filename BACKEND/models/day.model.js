var mongoose = require("mongoose");
const tableSchema = require("./table.model").schema;

var daySchema = new mongoose.Schema({
  date: Date,
  tables: [tableSchema]
});

module.exports = mongoose.model('days', daySchema)