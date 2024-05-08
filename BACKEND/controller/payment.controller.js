const pdfCreator = require('pdf-creator-node');
const fs = require('fs'); //Use Node.js's fs module to delete the file from the filesystem.
const path = require('path');
const moment = require("moment"); //Use for format date and time
const paymentModel = require("../models/payment.model");


//Add item router controller
const addPayment = async(req,res) => { //async---java script is single threaded. So this cannot do two functions together that's why we use async.....await

    try{
    const{orderID,promotionID,amount} = req.body;

    const newPaymentData = {
        orderID: orderID,
        promotionID: promotionID,
        amount: amount,
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

        const orderID = req.query.orderID;
        const regex = new RegExp(`^${orderID}`, "i"); // Match from the beginning of the string
        const payment = await paymentModel.find({ orderID: regex });
         //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.

        console.log("orderID:", orderID)
        console.log("payment:", payment)

        return res.status(200).send({
            status: true,
            message: "✨ :: Project Searched and fetched!",
            searchPayment: payment
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
        const{ orderID,promotionID,amount } = req.body;

        const paymentData = {
            orderID: orderID,
            promotionID: promotionID,
            amount: amount
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

// Function to generate and serve the PDF invoice
const PaymentGenerateInvoice = async (req, res) => {
    try {
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/payment_invoice_template.html'), 'utf-8');
       
        const CreatedDate = moment().format('YYYY MMMM DD');
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = 'Payment_Management_' + timestamp + '_doc' + '.pdf';
     
        const payments = await paymentModel.find({});

        let paymentArray = [];

        payments.forEach(i => {

            const formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(i.createdAt);
            
            const it = {
                date: formattedDate,
                orderID: i.orderID,
                promotionID: i.promotionID,
                amount: i.amount
            }
            paymentArray.push(it);
        })
       
        // Calculate the total amount by reducing the items array
        const grandTotal = paymentArray.reduce((amount, payment) => amount + payment.amount, 0); //0: This is the initial value of total. In this case, it starts at 0.

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
                CreatedDate,
                paymentArray,
                grandTotal,
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



module.exports = {
    addPayment, 
    getAllPayments, 
    getOnePayment, 
    updatePayment, 
    deletePayment,
    searchPayment,  
    PaymentGenerateInvoice,                  
}