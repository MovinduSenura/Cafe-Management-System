
const customerModel = require("../models/customer.model");
const pdfCreator = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const moment = require("moment");
const { ApiResponse, ApiError, asyncHandler } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Add customer
const addCustomer = asyncHandler(async (req, res) => {
    const { customerFullName, customerEmail, customerContactNo, customerNIC, customerGender, customerAddress, customerLoyaltyPoints } = req.body;

    // Check if customer already exists
    const existingCustomer = await customerModel.findOne({
        $or: [{ customerEmail }, { customerNIC }]
    });

    if (existingCustomer) {
        throw new ApiError(400, "Customer with this email or NIC already exists");
    }

    const newCustomerData = {
        customerFullName,
        customerEmail,
        customerContactNo,
        customerNIC,
        customerGender,
        customerAddress,
        customerLoyaltyPoints: customerLoyaltyPoints || 0,
    };

    const newCustomer = await customerModel.create(newCustomerData);
    
    logger.info(`New customer created: ${newCustomer._id}`);

    res.status(201).json(
        new ApiResponse(201, newCustomer, "Customer created successfully")
    );
});

// Get all customers with pagination
const getAllCustomers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const customers = await customerModel.find({ isActive: true })
        .select('-feedbacks')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await customerModel.countDocuments({ isActive: true });

    const result = {
        customers,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };

    res.status(200).json(
        new ApiResponse(200, result, "Customers fetched successfully")
    );
});

// Get one customer
const getOneCustomer = asyncHandler(async (req, res) => {
    const customerId = req.params.id;
    
    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid customer ID format");
    }

    const customer = await customerModel.findById(customerId);

    if (!customer || !customer.isActive) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json(
        new ApiResponse(200, customer, "Customer fetched successfully")
    );
});

// Update customer
const updateCustomer = asyncHandler(async (req, res) => {
    const customerId = req.params.id;
    
    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid customer ID format");
    }

    // Check if email or NIC is being updated and already exists
    if (req.body.customerEmail || req.body.customerNIC) {
        const existingCustomer = await customerModel.findOne({
            _id: { $ne: customerId },
            $or: [
                ...(req.body.customerEmail ? [{ customerEmail: req.body.customerEmail }] : []),
                ...(req.body.customerNIC ? [{ customerNIC: req.body.customerNIC }] : [])
            ]
        });

        if (existingCustomer) {
            throw new ApiError(400, "Customer with this email or NIC already exists");
        }
    }

    const updatedCustomer = await customerModel.findByIdAndUpdate(
        customerId,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
        throw new ApiError(404, "Customer not found");
    }

    logger.info(`Customer updated: ${customerId}`);

    res.status(200).json(
        new ApiResponse(200, updatedCustomer, "Customer updated successfully")
    );
});

// Delete customer (soft delete)
const deleteCustomer = asyncHandler(async (req, res) => {
    const customerId = req.params.id;
    
    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid customer ID format");
    }

    const customer = await customerModel.findByIdAndUpdate(
        customerId,
        { isActive: false },
        { new: true }
    );

    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    logger.info(`Customer soft deleted: ${customerId}`);

    res.status(200).json(
        new ApiResponse(200, null, "Customer deleted successfully")
    );
});

// Search customers
const searchCustomer = asyncHandler(async (req, res) => {
    const { customerNIC, customerName, customerEmail } = req.query;
    
    if (!customerNIC && !customerName && !customerEmail) {
        throw new ApiError(400, "Search term is required");
    }

    const searchConditions = [];
    
    if (customerNIC) {
        searchConditions.push({ customerNIC: { $regex: customerNIC, $options: 'i' } });
    }
    if (customerName) {
        searchConditions.push({ customerFullName: { $regex: customerName, $options: 'i' } });
    }
    if (customerEmail) {
        searchConditions.push({ customerEmail: { $regex: customerEmail, $options: 'i' } });
    }

    const customers = await customerModel.find({
        isActive: true,
        $or: searchConditions
    }).select('-feedbacks').limit(20);

    res.status(200).json(
        new ApiResponse(200, customers, "Customers found successfully")
    );
});

// Generate customer invoice PDF
const customerGenerateInvoice = asyncHandler(async (req, res) => {
    try {
        const htmlTemplate = await fs.promises.readFile(
            path.join(__dirname, '../template/customer-invoice-template.html'), 
            'utf-8'
        );
       
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = `Customer_Details_${timestamp}.pdf`;
     
        const customers = await customerModel.find({ isActive: true }).select('-feedbacks');

        const customerArray = customers.map(customer => ({
            customerFullName: customer.customerFullName,
            customerEmail: customer.customerEmail,
            customerContactNo: customer.customerContactNo,
            customerNIC: customer.customerNIC,
            customerLoyaltyPoints: customer.customerLoyaltyPoints,
        }));
       
        // Taking logo path
        const logoPath = path.join(__dirname, '../template/images/logo.png');
        let logoBase64 = '';
        
        try {
            const logoBuffer = await fs.promises.readFile(logoPath);
            logoBase64 = logoBuffer.toString('base64');
        } catch (logoError) {
            logger.warn('Logo file not found, continuing without logo');
        }

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
            header: { height: '0mm' },
            footer: { height: '0mm' },
            zoomFactor: '1.0',
            type: 'buffer',
        };

        const document = {
            html: htmlTemplate,
            data: {
                customerArray,
                logoBuffer: logoBase64,
                generatedDate: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            path: `./docs/${filename}`,
        };

        await pdfCreator.create(document, options);
        const filepath = `${req.protocol}://${req.get('host')}/docs/${filename}`;

        logger.info(`Customer report generated: ${filename}`);

        res.status(200).json(
            new ApiResponse(200, { filepath }, "Report generated successfully")
        );
    } catch (error) {
        logger.error('Error generating PDF invoice:', error);
        throw new ApiError(500, 'Failed to generate report');
    }
});

// Add feedback
const addFeedback = asyncHandler(async (req, res) => {
    const { DayVisited, TimeVisited, Comment, rating } = req.body;
    const userid = req.params.userid;

    if (!userid.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid user ID format");
    }

    const user = await customerModel.findById(userid);

    if (!user || !user.isActive) {
        throw new ApiError(404, "Customer not found");
    }
    
    user.feedbacks.push({ DayVisited, TimeVisited, Comment, rating });
    await user.save();

    logger.info(`Feedback added for customer: ${userid}`);

    res.status(201).json(
        new ApiResponse(201, user.feedbacks[user.feedbacks.length - 1], "Feedback added successfully")
    );
});

// Get feedback for a specific user
const getFeedback = asyncHandler(async (req, res) => {
    const userid = req.params.userid;

    if (!userid.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid user ID format");
    }

    const user = await customerModel.findById(userid).select('feedbacks customerFullName');

    if (!user || !user.isActive) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json(
        new ApiResponse(200, { 
            customer: user.customerFullName,
            feedbacks: user.feedbacks 
        }, "Feedbacks fetched successfully")
    );
});

// Get all feedbacks from all customers
const getAllFeedbacks = asyncHandler(async (req, res) => {
    const customers = await customerModel.find({ 
        isActive: true,
        'feedbacks.0': { $exists: true }
    }).select('customerFullName feedbacks');

    const allFeedbacks = customers.flatMap(customer => 
        customer.feedbacks.map(feedback => ({
            ...feedback.toObject(),
            customerName: customer.customerFullName,
            customerId: customer._id
        }))
    );

    res.status(200).json(
        new ApiResponse(200, allFeedbacks, "All feedbacks fetched successfully")
    );
});

// Get one specific feedback
const getOneFeedback = asyncHandler(async (req, res) => {
    const { customerNIC, feedbackId } = req.params;

    const user = await customerModel.findOne({ customerNIC, isActive: true });

    if (!user) {
        throw new ApiError(404, 'Customer not found');
    }

    const feedback = user.feedbacks.find(fb => fb._id.toString() === feedbackId);

    if (!feedback) {
        throw new ApiError(404, 'Feedback not found');
    }

    res.status(200).json(
        new ApiResponse(200, { feedback, customerName: user.customerFullName }, "Feedback fetched successfully")
    );
});

// Search feedback
const searchFeedback = asyncHandler(async (req, res) => {
    const { DayVisited } = req.query;
    
    if (!DayVisited) {
        throw new ApiError(400, "Search term is required");
    }

    const customers = await customerModel.find({ 
        isActive: true,
        'feedbacks.DayVisited': { $regex: new RegExp(`^${DayVisited}`, 'i') } 
    }).select('customerFullName feedbacks');

    const matchingFeedbacks = customers.flatMap(customer => 
        customer.feedbacks
            .filter(feedback => feedback.DayVisited.toLowerCase().startsWith(DayVisited.toLowerCase()))
            .map(feedback => ({
                ...feedback.toObject(),
                customerName: customer.customerFullName,
                customerId: customer._id
            }))
    );

    res.status(200).json(
        new ApiResponse(200, matchingFeedbacks, "Feedbacks found successfully")
    );
});

// Update feedback
const updateFeedback = asyncHandler(async (req, res) => {
    const { customerNIC, feedbackId } = req.params;
    const { DayVisited, TimeVisited, Comment, rating } = req.body;

    const updateData = { DayVisited, TimeVisited, Comment, rating };

    const customer = await customerModel.findOneAndUpdate(
        { customerNIC, 'feedbacks._id': feedbackId },
        { $set: { 'feedbacks.$': updateData } },
        { new: true, runValidators: true }
    );

    if (!customer) {
        throw new ApiError(404, "Customer or feedback not found");
    }

    const updatedFeedback = customer.feedbacks.find(fb => fb._id.toString() === feedbackId);

    logger.info(`Feedback updated: ${feedbackId} for customer: ${customerNIC}`);

    res.status(200).json(
        new ApiResponse(200, updatedFeedback, "Feedback updated successfully")
    );
});

// Delete feedback
const deleteFeedback = asyncHandler(async (req, res) => {
    const { userId, feedbackId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid user ID format");
    }

    const user = await customerModel.findById(userId);

    if (!user || !user.isActive) {
        throw new ApiError(404, 'Customer not found');
    }

    const feedbackIndex = user.feedbacks.findIndex(
        feedback => feedback._id.toString() === feedbackId
    );

    if (feedbackIndex === -1) {
        throw new ApiError(404, 'Feedback not found');
    }

    user.feedbacks.splice(feedbackIndex, 1);
    await user.save();

    logger.info(`Feedback deleted: ${feedbackId} for customer: ${userId}`);

    res.status(200).json(
        new ApiResponse(200, null, 'Feedback deleted successfully')
    );
});

// Login feedback (find customer by NIC)
const loginFeedback = asyncHandler(async (req, res) => {
    const customerNIC = req.params.nic;

    const user = await customerModel.findOne({ customerNIC, isActive: true });

    if (!user) {
        throw new ApiError(404, 'Customer not found');
    }

    res.status(200).json(
        new ApiResponse(200, { 
            _id: user._id,
            customerFullName: user.customerFullName,
            customerEmail: user.customerEmail,
            customerLoyaltyPoints: user.customerLoyaltyPoints
        }, 'Customer found successfully')
    );
});

// Get all feedbacks (alternative method)
const allFeedbacks = asyncHandler(async (req, res) => {
    const customers = await customerModel.find({ 
        isActive: true,
        'feedbacks.0': { $exists: true }
    }).select('customerFullName feedbacks');

    const allFeedbacks = customers.reduce((feedbacks, customer) => {
        const customerFeedbacks = customer.feedbacks.map(feedback => ({
            ...feedback.toObject(),
            customerName: customer.customerFullName,
            customerId: customer._id
        }));
        feedbacks.push(...customerFeedbacks);
        return feedbacks;
    }, []);

    res.status(200).json(
        new ApiResponse(200, allFeedbacks, "All feedbacks fetched successfully")
    );
});

// Get feedback by ID
const getFeedbackById = asyncHandler(async (req, res) => {
    const feedbackId = req.params.feedbackId;

    const customer = await customerModel.findOne({ 
        'feedbacks._id': feedbackId,
        isActive: true 
    }).select('customerFullName feedbacks.$');

    if (!customer || !customer.feedbacks.length) {
        throw new ApiError(404, 'Feedback not found');
    }

    const feedback = {
        ...customer.feedbacks[0].toObject(),
        customerName: customer.customerFullName
    };

    res.status(200).json(
        new ApiResponse(200, feedback, "Feedback fetched successfully")
    );
});

// Get customer name and loyalty points by identifier
const getNameAndLoyaltyPoints = asyncHandler(async (req, res) => {
    const { identifier } = req.params;

    const customer = await customerModel.findOne({
        isActive: true,
        $or: [
            { customerContactNo: identifier }, 
            { customerFullName: { $regex: identifier, $options: 'i' } }
        ]
    }).select('_id customerFullName customerLoyaltyPoints');

    if (!customer) {
        throw new ApiError(404, 'Customer not found');
    }

    res.status(200).json(
        new ApiResponse(200, {
            _id: customer._id,
            customerFullName: customer.customerFullName,
            customerLoyaltyPoints: customer.customerLoyaltyPoints
        }, "Customer details fetched successfully")
    );
});

// Update loyalty points
const updateLoyaltyPoints = asyncHandler(async (req, res) => {
    const customerId = req.params.id;
    const { customerLoyaltyPoints } = req.body;

    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid customer ID format");
    }

    if (typeof customerLoyaltyPoints !== 'number' || customerLoyaltyPoints < 0) {
        throw new ApiError(400, "Invalid loyalty points value");
    }

    const customer = await customerModel.findByIdAndUpdate(
        customerId,
        { customerLoyaltyPoints },
        { new: true, runValidators: true }
    ).select('customerFullName customerLoyaltyPoints');

    if (!customer) {
        throw new ApiError(404, 'Customer not found');
    }

    logger.info(`Loyalty points updated for customer: ${customerId}`);

    res.status(200).json(
        new ApiResponse(200, {
            customerLoyaltyPoints: customer.customerLoyaltyPoints,
            customerName: customer.customerFullName
        }, 'Loyalty points updated successfully')
    );
});

// Post reply to feedback
const postReplyToFeedback = asyncHandler(async (req, res) => {
    const { feedbackId } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim().length === 0) {
        throw new ApiError(400, "Reply cannot be empty");
    }

    const customer = await customerModel.findOneAndUpdate(
        { "feedbacks._id": feedbackId, isActive: true },
        { "$set": { "feedbacks.$.reply": reply.trim() } },
        { new: true }
    );

    if (!customer) {
        throw new ApiError(404, 'Feedback not found');
    }

    const updatedFeedback = customer.feedbacks.find(fb => fb._id.toString() === feedbackId);

    logger.info(`Reply added to feedback: ${feedbackId}`);

    res.status(200).json(
        new ApiResponse(200, updatedFeedback, 'Reply added successfully')
    );
});

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
};