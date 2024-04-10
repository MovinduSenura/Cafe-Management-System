
const customerModel = require("../models/customer.model");

//Add item router controller
//req means requests coming from front end.
//await can only be used with asynchronous
//save wena eka eetklin ewata klin wena eka nwttnw.
const addCustomer = async (req,res) => {

    try{

    const { customerFullName, customerEmail, customerContactNo, customerNIC, customerGender, customerAddress, customerLoyaltyPoints} = req.body;

    //1st para is model name. 2nd para is the above one.
    const newCustomerData = {
        customerFullName : customerFullName,
        customerEmail : customerEmail,
        customerContactNo : customerContactNo,
        customerNIC : customerNIC,
        customerGender : customerGender,
        customerAddress : customerAddress,
        customerLoyaltyPoints : customerLoyaltyPoints,
    }

    //creating an object of customerModel - newCustomerObj, in brackets-above class name, here the data in above class are stored in newCustomerObj object in CustomerModel.
    const newCustomerObj = new customerModel(newCustomerData);
    await newCustomerObj.save();

    return res.status(200).send({
        status: true,
        message:"Data saved successfully⭐"
    })

    
} catch(err){
    return res.status(500).send({
        status: false,
        message: err.message
    })
}
}

//get All items from router controller
//take all data from database and put them into all items
const getAllCustomers = async (req, res) => {

    try{
        const allCustomers = await customerModel.find();
//Allcustomers red eka hrha anek eke thyena data front end ekt ywnw. e ynne array ekk wdyta
        return res.status(200).send({
            status: true,
            message: "⭐ All customers are fetched!",
            Allcustomers: allCustomers, 
        })

    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,


        })

    }
}

//get one specifies item router controller
const getOneCustomer = async(req,res) => {
    
    try{

        const customerId = req.params.id;
        const customer = await customerModel.findById(customerId);

        return res.status(200).send({
            status: true,
            message: "Customer Fetched⭐",
            Customer: customer,
        })
    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,
        })
    }

}

//get- serach particular customer
const searchCustomer = async (req, res) => {

    try{

        const CustomerNIC = req.query.customerNIC;
        // Using a regular expression to match partial game names
        //regex- ghna akurata match wena eka enw
        const customer = await customerModel.find({ customerNIC: { $regex: CustomerNIC, $options: 'i' } }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.
                                            //customerNIC == CustomerNIC samanada kyl blnw 

        return res.status(200).send({
            status: true,
            message: "✨ :: Project Searched and fetched!",
            customerSearch : customer
        })

    }catch(err){

        return res.status(500).send({
            status: false,
            message: err.message
        });

    }

}

const updateCustomer = async (req,res) => {

    try{
         //id allagnne params.id data allagnne body eken
        const customerId = req.params.id;
        const {customerFullName, customerEmail, customerContactNo, customerNIC, customerGender, customerAddress, customerLoyaltyPoints} = req.body;
    
        const customerData = {
            customerFullName : customerFullName,
            customerEmail : customerEmail,
            customerContactNo : customerContactNo,
            customerNIC : customerNIC,
            customerGender : customerGender,
            customerAddress : customerAddress,
            customerLoyaltyPoints : customerLoyaltyPoints,
        }

        const updateCustomerObj = await customerModel.findByIdAndUpdate(customerId, customerData);

        return res.status(200).send({
        status: true,
        message: "Customer updated⭐"
        })

        }catch(err) {
            //database eken arn response eka front end ekt dnwnm witrai methna third line oni.. so update ekt oni na. dmmat case na.
            return res.status(500).send({
                status: false,
                message: err.message,
            })
        }
   
}

//Delete customer
const deleteCustomer = async (req,res) => {

    try{

        const customerId = req.params.id;
        const delItem = await customerModel.findByIdAndDelete(customerId);

        return res.status(200).send({
            status: true,
            message: "Customer Deleted⭐",
        })
    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message,
        })

    }

   
}

//exporting, get all item router controller
module.exports = {
    addCustomer,
    getAllCustomers,
    getOneCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomer,
}