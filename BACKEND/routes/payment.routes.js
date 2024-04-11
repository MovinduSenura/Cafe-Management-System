const express = require("express");
const paymentRouter = express.Router();

const {
    addPayment,
    getAllPayments,
    getOnePayment,
    updatePayment,
    deletePayment,
    searchPayment,

} = require("../controller/payment.controller")

//post(URL,function)
paymentRouter.post('/create',addPayment);
paymentRouter.get('/getAllPayment',getAllPayments);
paymentRouter.get('/getOne/:id',getOnePayment);
paymentRouter.patch('/updatePayment/:id',updatePayment);
paymentRouter.delete('/deletePayment/:id',deletePayment);
paymentRouter.get('/searchPayment',searchPayment)


module.exports = paymentRouter;