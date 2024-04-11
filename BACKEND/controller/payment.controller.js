const paymentModel = require("../models/payment.model");

//Add item router controller
const addPayment = async(req,res) => { //async---java script is single threaded. So this cannot do two functions together that's why we use async.....await

    try{
    const{orderID,promotionID,amount,date} = req.body;

    const newPaymentData = {
        orderID: orderID,
        promotionID: promotionID,
        amount: amount,
        date: date,
    }

    //newPaymentObj->paymentModel object  ---assign newPaymentData object data into newPaymentObj
    const newPaymentObj = new paymentModel(newPaymentData);
    await newPaymentObj.save();//until async part done this part will be hold

    //static codes(alsways like this in res. Only change the number)
    return res.status(200).send({
        status: true,
        message:"🌟 :: Data saved successfuly!"
    })
}catch(err){
    return res.status(500).send({
        status: false,
        message: err.message
    })
}

}


//get all item router controller
const getAllPayments = async(req,res)=>{

    try{
        const allPayments = await paymentModel.find();//find data in monogoDB database

        return res.status(200).send({
        status:true,
        message: "🌟 :: All payments are fetched!",
        allPayments:allPayments
    })

    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message
        })     
    }
    
}

//get one-specified item router controller
const getOnePayment = async(req,res) => {
    try{

        const paymentID = req.params.id;
        const payment = await paymentModel.findById(paymentID);

        return res.status(200).send({
            status: true,
            message: "🌟:: Payment Fetched!",
            payment : payment,
        })

    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })

    }               
}

//get - search particular payment
const searchPayment = async (req, res) => {

    try{

        const amount = req.query.amount;
        // Using a regular expression to match partial game names
        const amountPayment = await paymentModel.find({ amount: parseFloat(amount) }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.

        return res.status(200).send({
            status: true,
            message: "✨ :: Project Searched and fetched!",
            searchPayment: amountPayment
        })

    }catch(err){

        return res.status(500).send({
            status: false,
            message: err.message
        });

    }

}

//Update item details router controller
const updatePayment = async(req,res) => {

    try{
        const paymentID =  req.params.id;
        const{ orderID,promotionID,amount,date } = req.body;

        const paymentData = {
            orderID: orderID,
            promotionID: promotionID,
            amount: amount,
            date: date,
        }

        const updatePaymentObj = await paymentModel.findByIdAndUpdate(paymentID,paymentData);

        return res.status(200).send({
            status:true,
            message:"🌟 :: Payment updated!"
        })
    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })
    }
}

//Delete
const deletePayment = async(req,res) =>{
    try{
        const paymentID =  req.params.id;
        const dltPayment = await paymentModel.findByIdAndDelete(paymentID);

        return res.status(200).send({
            status:true,
            message:"🌟 :: Payment deleted"
        })
    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })
    }
}


module.exports = {
    addPayment, 
    getAllPayments, 
    getOnePayment, 
    updatePayment, 
    deletePayment,
    searchPayment,                    
}