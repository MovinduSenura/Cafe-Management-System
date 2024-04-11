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
} = require("../controller/customer.controller");

CustomerRouter.post('/customercreate', addCustomer);
CustomerRouter.get('/customers', getAllCustomers);
CustomerRouter.get('/customer/:id', getOneCustomer);
CustomerRouter.patch('/customerUpdate/:id', updateCustomer);
CustomerRouter.delete('/customerdelete/:id', deleteCustomer);
CustomerRouter.get('/customersearch', searchCustomer);

module.exports = CustomerRouter;