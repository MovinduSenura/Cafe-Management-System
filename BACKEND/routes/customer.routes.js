const express = require ("express");
const CustomerRouter = express.Router();

//passing two parameters to send data. 1-linkto call 2-functionto run when calling link in1
const {
    addCustomer,
    getAllCustomers,
    getOneCustomer,
    updateCustomer,
    deleteCustomer,
    customerGenerateInvoice,
    searchCustomer,
    addFeedback,
    getFeedback,
    getOneFeedback,
    updateFeedback,
    deleteFeedback,
    loginFeedback,
    allFeedbacks,
    searchFeedback,
    getAllFeedbacks,
    getFeedbackById,
    postReplyToFeedback,
    getNameAndLoyaltyPoints,
    updateLoyaltyPoints,
} = require("../controller/customer.controller");


CustomerRouter.post('/customercreate', addCustomer);
CustomerRouter.get('/customers', getAllCustomers);
CustomerRouter.get('/customer/:id', getOneCustomer);
CustomerRouter.patch('/customerUpdate/:id', updateCustomer);
CustomerRouter.delete('/customerdelete/:id', deleteCustomer);
CustomerRouter.get('/customersearch', searchCustomer);

//Chethmi
CustomerRouter.get('/customerByFind/:identifier', getNameAndLoyaltyPoints);
CustomerRouter.patch('/customerUpdateLoyaltyPoints/:id', updateLoyaltyPoints);
CustomerRouter.get('/customer-generate-invoice', customerGenerateInvoice)

//Sithmi
CustomerRouter.post('/addfeedback/:userid', addFeedback);
CustomerRouter.get('/getfeedback/:userid', getFeedback);
CustomerRouter.get('/getonefeedback/:customerNIC/:feedbackId',getOneFeedback);
CustomerRouter.patch('/updatefeedback/:userId/:feedbackId',updateFeedback);
CustomerRouter.delete('/deletefeedback/:userId/:feedbackId',deleteFeedback);
CustomerRouter.get('/login/:nic', loginFeedback);
CustomerRouter.put('/feedback/:customerNIC/:feedbackId', updateFeedback);
CustomerRouter.get('/feedback/all', allFeedbacks);
CustomerRouter.get('/feedbacksearch', searchFeedback);
CustomerRouter.get('/feedbackall', getAllFeedbacks);
CustomerRouter.get("/userfeedback/:feedbackId",getFeedbackById);
// Assuming you are using express.Router() and it's defined as CustomerRouter
CustomerRouter.post('/feedback/:feedbackId/reply', postReplyToFeedback);



module.exports = CustomerRouter;