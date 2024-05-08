const express = require("express")
const reservationRouter = express.Router();

const { getAllReservations, createReservation } = require("../controller/reservation.controller");

reservationRouter.get('/', getAllReservations)
reservationRouter.post('/', createReservation)

module.exports = reservationRouter;