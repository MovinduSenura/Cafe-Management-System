
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
        const {DayVisited,TimeVisited,Comment} = req.body;
        const userid = req.params.userid;
        const user = await customerModel.findById(userid);

        if(!user){
            return res.status(400).json({status:"user not found"})
        }
        
        user.feedbacks.push({DayVisited,TimeVisited,Comment});
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


// const searchFeedback = async (req, res) => {

//     try{

//         const Comment = req.query.Comment;
        
//         const feedback = await customerModel.find(
//             { 'feedbacks': { $elemMatch: { Comment: { $regex: new RegExp(Comment, 'i') } } } },
//             { 'feedbacks.$': 1, '_id': 0 }
//         );
//         console.log("Comment: ", Comment);
        
//         const allComments = feedback.flatMap(item => item.feedbacks.map(feedbackItem => feedbackItem.Comment));

        
//         console.log("All Comments:", allComments);
        

//         return res.status(200).send({
//             status: true,
//             message: "✨ :: Project Searched and fetched!",
//             searchedFeedback: allComments
//         })

//     }catch(err){

//         return res.status(500).send({
//             status: false,
//             message: err.message
//         });

//     }

// }

// const searchFeedback = async (req, res) => {
//     try {
//         const Comment = req.query.Comment;
//         const feedback = await customerModel.find({ 'feedbacks.Comment': { $regex: new RegExp(`^${Comment}`, 'i') } });
//         console.log("Comment: ", Comment);
//         console.log("Feeback: ", feedback);

//         return res.status(200).send({
//             status: true,
//             message: "✨ :: Feedbacks searched and fetched!",
//             searchedFeedback: feedback
//         });
//     } catch (err) {
//         return res.status(500).send({
//             status: false,
//             message: err.message
//         });
//     }
// };

// const searchFeedback = async (req, res) => {
//     try {
//         const { DayVisited } = req.query;

//         // Using a regular expression to match partial DayVisited
//         const feedback = await customerModel.find({
//             'feedbacks.DayVisited': { $regex: new RegExp(DayVisited, 'i') }
//         });

//         return res.status(200).send({
//             status: true,
//             message: "✨ Project Searched and fetched!",
//             searchedFeedback: feedback
//         });
//     } catch (err) {
//         return res.status(500).send({
//             status: false,
//             message: err.message
//         });
//     }
// };

// const searchFeedback = async (req, res) => {
//     try {
//         const { DayVisited } = req.query;

//         // Using aggregation to search within nested array
//         const feedback = await customerModel.aggregate([
//             {
//                 $unwind: "$feedbacks" // Deconstructs the feedbacks array
//             },
//             {
//                 $match: {
//                     "feedbacks.DayVisited": { $regex: new RegExp(DayVisited, 'i') }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$_id",
//                     customerFullName: { $first: "$customerFullName" }, // You can include other fields if needed
//                     searchedFeedback: { $push: "$feedbacks" }
//                 }
//             }
//         ]);

//         return res.status(200).send({
//             status: true,
//             message: "✨ Project Searched and fetched!",
//             searchedFeedback: feedback
//         });
//     } catch (err) {
//         return res.status(500).send({
//             status: false,
//             message: err.message
//         });
//     }
// };

const updateFeedback =async(req,res) => {
    const { customerNIC, feedbackId } = req.params;
   
    const { DayVisited, TimeVisited, Comment } = req.body;

    //const patient = await User.findById(userId);

    const updateFeedback = {
        DayVisited, TimeVisited, Comment
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




//exporting, get all item router controller
module.exports = {
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
    searchFeedback,
    getAllFeedbacks,

    getNameAndLoyaltyPoints,
    updateLoyaltyPoints,

}