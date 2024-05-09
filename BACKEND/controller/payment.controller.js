const pdfCreator = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const moment = require("moment");
const paymentModel = require("../models/payment.model");

// Add item router controller with backend validations
const addPayment = async (req, res) => {
    try {
        const { orderID, promotionID, amount } = req.body;

        // Validate incoming data
        if (!orderID || !amount) {
            return res.status(400).send({
                status: false,
                message: "Validation Error: Missing required fields."
            });
        }

        // Create new payment object
        const newPaymentData = {
            orderID: orderID,
            promotionID: promotionID,
            amount: amount,
        }

        const newPaymentObj = new paymentModel(newPaymentData);
        await newPaymentObj.save();

        return res.status(200).send({
            status: true,
            message: "🌟 :: Data saved successfully!"
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

// Function to get all payments with backend validations
const getAllPayments = async (req, res) => {
    try {
        const allPayments = await paymentModel.find();
        return res.status(200).send({
            status: true,
            message: "🌟 :: All payments are fetched!",
            allPayments: allPayments
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

// Function to get one specified payment with backend validations
const getOnePayment = async (req, res) => {
    try {
        const paymentID = req.params.id;

        // Validate payment ID
        if (!paymentID) {
            return res.status(400).send({
                status: false,
                message: "Validation Error: Payment ID is required."
            });
        }

        const payment = await paymentModel.findById(paymentID);

        return res.status(200).send({
            status: true,
            message: "🌟 :: Payment Fetched!",
            payment: payment,
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message,
        });
    }
}

// Function to search for a particular payment with backend validations
const searchPayment = async (req, res) => {
    try {
        const orderID = req.query.orderID;

        // Validate order ID
        if (!orderID) {
            return res.status(400).send({
                status: false,
                message: "Validation Error: Order ID is required."
            });
        }

        const regex = new RegExp(`^${orderID}`, "i");
        const payment = await paymentModel.find({ orderID: regex });

        return res.status(200).send({
            status: true,
            message: "✨ :: Payment Searched and fetched!",
            searchPayment: payment
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }
}

// Function to update payment details with backend validations
const updatePayment = async (req, res) => {
    try {
        const paymentID = req.params.id;
        const { orderID, promotionID, amount } = req.body;

        // Validate payment ID and incoming data
        if (!paymentID || !orderID || !promotionID || !amount) {
            return res.status(400).send({
                status: false,
                message: "Validation Error: Missing required fields."
            });
        }

        const paymentData = {
            orderID: orderID,
            promotionID: promotionID,
            amount: amount
        }

        const updatePaymentObj = await paymentModel.findByIdAndUpdate(paymentID, paymentData);

        return res.status(200).send({
            status: true,
            message: "🌟 :: Payment updated!"
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message,
        });
    }
}

// Function to delete payment with backend validations
const deletePayment = async (req, res) => {
    try {
        const paymentID = req.params.id;

        // Validate payment ID
        if (!paymentID) {
            return res.status(400).send({
                status: false,
                message: "Validation Error: Payment ID is required."
            });
        }

        const dltPayment = await paymentModel.findByIdAndDelete(paymentID);

        return res.status(200).send({
            status: true,
            message: "🌟 :: Payment deleted"
        });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message,
        });
    }
}

// Function to generate and serve the PDF invoice
const PaymentGenerateInvoice = async (req, res) => {
    try {
        // Read HTML template file
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/payment_invoice_template.html'), 'utf-8');

        // Generate timestamp and filename
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = 'Payment_Management_' + timestamp + '_doc' + '.pdf';

        // Fetch all payments
        const payments = await paymentModel.find({});

        // Format payment data
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
        });

        // Calculate grand total
        const grandTotal = paymentArray.reduce((amount, payment) => amount + payment.amount, 0);

        // Load logo image
        const logoPath = path.join(__dirname, '../template/images/logo.png');
        const logoBuffer = await fs.promises.readFile(logoPath);
        const logoBase64 = logoBuffer.toString('base64');

        // PDF options
        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
            header: { height: '0mm' },
            footer: { height: '0mm' },
            zoomFactor: '1.0',
            type: 'buffer',
        };

        // PDF document data
        const document = {
            html: htmlTemplate,
            data: {
                paymentArray,
                grandTotal,
                logoBuffer: logoBase64,
            },
            path: './docs/' + filename,
        };

        // Create PDF
        const pdfBuffer = await pdfCreator.create(document, options);

        // Send file path in response
        const filepath = 'http://localhost:8000/docs/' + filename;
        res.status(200).json({ filepath });
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
