const dayModel = require("../models/day.model")
const reservationModel = require("../models/reservation.model")

const getAllReservations = async (r, q) => {
    try {
        const allReservations = await reservationModel.find()

        return q.status(200).send({
            status: true,
            message: "All reservations found",
            reservations: allReservations
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error
        })
    }
}


const createReservation = async (req, res) => {
  try {
      const days = await dayModel.find({ date: req.body.date }).exec();
      
      if (days.length > 0) {
          const day = days[0];
          const table = day.tables.find(table => table._id == req.body.table);

          if (table) {
              table.reservation = new reservationModel({
                  name: req.body.name,
                  phone: req.body.phone,
                  email: req.body.email
              });
              table.isAvailable = false;

              await day.save();
              console.log("Reserved");
              res.status(200).send("Added Reservation");
          } else {
              console.log("Table not found");
              res.status(404).send("Table not found");
          }
      } else {
          console.log("Day not found");
          res.status(404).send("Day not found");
      }
  } catch (error) {
      console.log("Error:", error);
      res.status(500).send({
          status: false,
          message: "Error processing request"
      });
  }
};


module.exports = { getAllReservations, createReservation }