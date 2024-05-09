
const customerModel = require("../models/customer.model");
const pdfCreator = require('pdf-creator-node');
const fs = require('fs'); //Use Node.js's fs module to delete the file from the filesystem.
const path = require('path');
const moment = require("moment"); //Use for format date and time



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

// Function to generate and serve the PDF invoice
const customerGenerateInvoice = async (req, res) => {
    try {
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/customer-invoice-template.html'), 'utf-8');
        // console.log(htmlTemplate);
       
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = 'Customer_Details_' + timestamp + '_doc' + '.pdf';
     
        const customers = await customerModel.find({});
        // console.log("items : ", items);

        let customerArray = [];

        customers.forEach(i => {
            
            const it = {
                customerFullName: i.customerFullName,
                customerEmail: i.customerEmail,
                customerContactNo: i.customerContactNo,
                customerNIC: i.customerNIC,
                customerLoyaltyPoints: i.customerLoyaltyPoints,// Include the total price in the item object
            }
            customerArray .push(it);
        })
       
        // Calculate the total amount by reducing the items array
        // const grandTotal = customerArray .reduce((total, item) => total + item.totalPrice, 0); //0: This is the initial value of total. In this case, it starts at 0.

        // Taking logo path
        const logoPath = path.join(__dirname, '../template/images/logo.png');
        // Load the logo image asynchronously
        const logoBuffer = await fs.promises.readFile(logoPath);
        // Encode the logo buffer to base64
        const logoBase64 = logoBuffer.toString('base64');

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
            header: {
                height: '0mm',
            },
            footer: {
                height: '0mm',
            },
            zoomFactor: '1.0',
            type: 'buffer',
        };

        const document = {
            html: htmlTemplate,
            data: {
                customerArray,
                logoBuffer: logoBase64, // Pass the logo buffer to the HTML template
            },
            path: './docs/' + filename,
        };

        const pdfBuffer = await pdfCreator.create(document, options);

        const filepath = 'http://localhost:8000/docs/' + filename;

        // Send the file path in the response
        res.status(200).json({ filepath });
        // res.contentType('application/pdf');
        // res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF invoice:', error);
        res.status(500).send('Internal Server Error');
    }
};
 

//get- serach particular customer
const searchCustomer = async (req, res) => {

    try{

        const CustomerNIC = req.query.customerNIC;
        // Using a regular expression to match partial game names
        //regex- ghna akurata match wena eka enw
        const customer = await customerModel.find({ customerNIC: { $regex: `^${CustomerNIC}`, $options: 'i' } }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.
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

//Sithmi
const addFeedback = async(req,res) => {
    try{
        const {DayVisited,TimeVisited,Comment,rating} = req.body;
        const userid = req.params.userid;
        const user = await customerModel.findById(userid);

        if(!user){
            return res.status(400).json({status:"user not found"})
        }
        
        user.feedbacks.push({DayVisited,TimeVisited,Comment,rating});
        await user.save();
        res.status(200).json({status:"New feedback added",user});

    }catch(err) {
        console.log(err);
        res.status(500).json({status:"Error adding new feedback",err});
    }
}

const getFeedback = async(req,res) => {
    try {
        
        const userid=req.params.userid;

        const feed=await customerModel.findById(userid).populate('feedbacks')
        .then((user)=>{
            res.status(200)
            .send({status:"feedback fetched",feedbacks:user.feedbacks})
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Server error"})
    }
}

const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await customerModel.find({}, { feedbacks: 1 });
        // console.log("feedbacks: ", feedbacks.map(customer => customer.feedbacks).flat());

        return res.status(200).send({
            status: true,
            message: "✨ All feedbacks fetched!",
            feedbacks: feedbacks.map(customer => customer.feedbacks).flat()
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }
};

const getOneFeedback = async(req,res) =>{
    try {
        const { customerNIC, feedbackId } = req.params;

        // Assuming you have a 'User' model with an 'feedbacks' field
        const user = await customerModel.findOne({customerNIC});
        

        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const feedback = user.feedbacks
        
        .find(
            (fb) => fb._id.toString() === feedbackId
        );
        

        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found',customerNIC,feedbackId });
        }

        // Return the feedback details
        res.status(200).json({ feedback });

    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const searchFeedback = async (req, res) => {
    try {
        const DayVisited = req.query.DayVisited;
        const feedbacks = await customerModel.find({ 'feedbacks.DayVisited': { $regex: new RegExp(`^${DayVisited}`, 'i') } });

        // const flattenedFeedbacks = feedbacks.map(customer => customer.feedbacks[0]).flat();
        // const flattenedFeedbacks = feedbacks.flatMap(customer => customer.feedbacks);

        const searchTerm = DayVisited; // Replace "your search term" with the term you're searching for
        // const flattenedFeedbacks = feedbacks.flatMap(customer => customer.feedbacks.filter(feedback => feedback.DayVisited === searchTerm));
        const flattenedFeedbacks = feedbacks.flatMap(customer => customer.feedbacks.filter(feedback => feedback.DayVisited.startsWith(searchTerm)));


        // console.log("feedbacks", flattenedFeedbacks);

        return res.status(200).send({
            status: true,
            message: "✨ :: Feedbacks searched and fetched!",
            searchedFeedback: flattenedFeedbacks
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }
};


const updateFeedback =async(req,res) => {
    const { customerNIC, feedbackId } = req.params;
   
    const { DayVisited, TimeVisited, Comment,rating } = req.body;

    //const patient = await User.findById(userId);

    const updateFeedback = {
        DayVisited, TimeVisited, Comment,rating
    };

    try {
        const update = await customerModel.findOneAndUpdate(
            { customerNIC, 'feedbacks._id': feedbackId },
            { $set: { 'feedbacks.$': updateFeedback } },
            { new: true }
        ).then(() => {
            res.status(200).send({ status: "Feedback Updated!", updateFeedback })
            console.log("saved",updateFeedback);
        });

        ////res.json(updateedPatient)
    } catch (error) {
        res.status(500).json({ error });
    }


}

const deleteFeedback = async(req,res) => {
    try {
        const { userId, feedbackId } = req.params;

        // Find the user by ID
        const user = await customerModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the index of the feedback to delete
        const feedbackIndex = user.feedbacks.findIndex(
            (feedback) => feedback._id.toString() === feedbackId
        );

        if (feedbackIndex === -1) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Remove the appointment from the array
        user.feedbacks.splice(feedbackIndex, 1);

        // Save the updated user
        await user.save();

        res.status(200).json({ status: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


}

const loginFeedback = async(req,res) =>{
    try {
        const customerNIC = req.params.nic;

        // Find the user by customerNIC
        const user = await customerModel.findOne({ customerNIC });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user data
        res.status(200).json({ status: 'User found', user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const allFeedbacks = async(req,res) => {
    try {
        // Find all users with appointments
        const usersWithFeedbacks = await customerModel.find({ feedbacks: { $exists: true, $not: { $size: 0 } } });

        // Extract all appointments from users
        const allFeedbacks = usersWithFeedbacks.reduce((feedbacks, user) => {
            feedbacks.push(...user.feedbacks);
            return feedbacks;
        }, []);

        // Send the appointments as JSON response
        res.json(allFeedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

}
//sithmi reply for feedback
const getFeedbackById = async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId;

        const feedback = await customerModel.findOne({ 'feedbacks._id': feedbackId }, { 'feedbacks.$': 1 });

        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(200).json({ feedback: feedback.feedbacks[0] });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





//Chethmi payment loyaltyPoint 
const getNameAndLoyaltyPoints = async (req, res) => {
    try {
        const { identifier } = req.params;

        // Find the customer by customerNIC or customerFullName
        const customer = await customerModel.findOne({
            $or: [{ customerContactNo: identifier }, { customerFullName: identifier }]
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Extract name and loyalty points
        const { _id,customerFullName, customerLoyaltyPoints } = customer;

        // Return name and loyalty points
        res.status(200).json({ _id,customerFullName, customerLoyaltyPoints });
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Chethmi - update loyalty points
const updateLoyaltyPoints = async (req, res) => {
    try {
        // Extract the customer ID and new loyalty points from the request parameters and body
        const customerId = req.params.id;
        const { customerLoyaltyPoints } = req.body;

        // Find the customer by ID
        const customer = await customerModel.findById(customerId);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Update the loyalty points
        customer.customerLoyaltyPoints = customerLoyaltyPoints;

        // Save the updated customer data
        await customer.save();

        // Return success response
        res.status(200).json({ status: 'Loyalty points updated successfully', customerLoyaltyPoints: customer.customerLoyaltyPoints });
    } catch (error) {
        console.error('Error updating loyalty points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///sithmi reply part
// Assuming you have a model called `CustomerModel` where feedbacks are stored in an array
const postReplyToFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const { reply } = req.body;

    try {
        const customer = await customerModel.findOneAndUpdate(
            { "feedbacks._id": feedbackId },
            { "$set": { "feedbacks.$.reply": reply } },
            { new: true }
        );
        if (!customer) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Reply added successfully', feedback: customer.feedbacks.id(feedbackId) });
    } catch (error) {
        console.error('Error posting reply to feedback:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};





//exporting, get all item router controller
module.exports = {
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

}