const express = require ("express");
const CustomerRouter = express.Router();

//passing two parameters to send data. 1-linkto call 2-functionto run when calling link in1
const {
    addCustomer,
    getAllCustomers,
    getOneCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomer,
    addFeedback,
    getFeedback,
    getOneFeedback,
    updateFeedback,
    deleteFeedback,
    loginFeedback,
    allFeedbacks,
} = require("../controller/customer.controller");


CustomerRouter.post('/customercreate', addCustomer);
CustomerRouter.get('/customers', getAllCustomers);
CustomerRouter.get('/customer/:id', getOneCustomer);
CustomerRouter.patch('/customerUpdate/:id', updateCustomer);
CustomerRouter.delete('/customerdelete/:id', deleteCustomer);
CustomerRouter.get('/customersearch', searchCustomer);

//Sithmi
CustomerRouter.post('/addfeedback/:userid', addFeedback);
CustomerRouter.get('/getfeedback/:userid', getFeedback);
CustomerRouter.get('/getonefeedback/:customerNIC/:feedbackId',getOneFeedback);
CustomerRouter.patch('/updatefeedback/:userId/:feedbackId',updateFeedback);
CustomerRouter.delete('/deletefeedback/:userId/:feedbackId',deleteFeedback);
CustomerRouter.get('/login/:nic', loginFeedback);
CustomerRouter.put('/feedback/:customerNIC/:feedbackId', updateFeedback);
CustomerRouter.get('/feedback/all',allFeedbacks);



module.exports = CustomerRouter;