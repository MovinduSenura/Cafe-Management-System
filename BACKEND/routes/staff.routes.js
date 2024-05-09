const express = require("express");
const staffRouter = express.Router();

const{
    addstaff,
    getAllstaff,
    getOnestaff,
    updatestaff,
    deletestaff,
    searchStaff,
    StaffLogin,
    staffGenerateInvoice,

}= require("../controller/staff.controller");
// const { default: StaffLogin } = require("../../frontend/src/components/StaffLogin");

staffRouter.post('/create',addstaff);
staffRouter.get('/staff',getAllstaff);
staffRouter.get('/staff/:id',getOnestaff);
staffRouter.patch('/staffupdate/:id',updatestaff);
staffRouter.delete('/deletestaff/:id',deletestaff);
staffRouter.post('/StaffLogin',StaffLogin);
staffRouter.get('/searchStaff',searchStaff);
staffRouter.get('/generate-invoice',staffGenerateInvoice);


module.exports = staffRouter;