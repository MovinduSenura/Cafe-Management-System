const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const staffModel = require("../models/staff.model");
const express = require('express');
const router = express.Router();
const pdfCreator = require('pdf-creator-node');
const fs = require('fs'); //Use Node.js's fs module to delete the file from the filesystem.
const path = require('path');
const moment = require("moment"); //Use for format date and time

//Add/Create staff router controller
const addstaff = async (req, res)=>{
    try{

        const {staffName,staffEmail,staffPassword,staffContactNo,staffAddress,staffAge,staffGender,staffRole,staffSalaryPerHours,staffWorkedHours} = req.body;
         
        // //check if staff already exists
        // let staff = await staff.findIne({staffEmail});
        // if(staff){
        //     return res.status (400).json({ msg: 'Staff already exists'});

        // }


        const newstaff={
            staffName:staffName,
            staffEmail:staffEmail,
            staffContactNo:staffContactNo,
            staffAddress:staffAddress,
            staffAge:staffAge,
            staffGender:staffGender,
            staffSalaryPerHours:staffSalaryPerHours,
            staffWorkedHours:staffWorkedHours,
            staffRole:staffRole,
            staffPassword:staffPassword
        }

         //Hash password
        const salt = await bcrypt.genSalt(10);
        newstaff.staffPassword= await bcrypt.hash(staffPassword, salt);





        const newstaffObj = new staffModel(newstaff);
        await newstaffObj.save();

        return res.status(200).send({
            status:true,
            message:"✨ :: Data saved successfully!"

        })

        }catch(err){
            return res.status(500).send({
                status:false,
                message:err.message
            })
        }
    }


    // Login
const StaffLogin=async(req,res) => {
    try {
        const { staffEmail, staffPassword } = req.body;

        // Check if user exists
        const staff = await staffModel.findOne({ staffEmail });
        if (!staff) {
            return res.status(400).json({ msg: 'Invalid Email' });
        }

        const staffRole = staff.staffRole;

        // Check password
        const isMatch = await bcrypt.compare(staffPassword, staff.staffPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        // Create JWT token
        const payload = {
            staff: {
                id: staff._id,
                staffRole: staff.staffRole
            }
        };

        jwt.sign(payload, '12345', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, staffRole });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg:'Server Error'
        });
    }
};

    //Get all staff router controller
    const getAllstaff = async (req, res) =>{

        try{

            const allstaff = await staffModel.find();

            // Find the staff member with the most worked hours
            const bestEmployee = allstaff.reduce((prev,current)=>(prev.staffWorkedHours > current.staffWorkedHours)? prev: current);
            
            return res.status(200).send({
                status: true,
                message:"✨ :: All items are fetched",
                AllStaff: allstaff,
                BestEmployee:bestEmployee//Add the best employee data
            })

        }catch(err){
            return res.status(500).send({
                status: false,
                message: err.message,
            })
        }
    }
   


    //Get one-specified item router controller
    const getOnestaff = async (req, res) =>{

        try{

            const staffID = req.params.id;
            const staff = await staffModel.findById(staffID);

            return res.status(200).send({
                status:true,
                message:"✨ :: Staff Members fetched!",
                Staff: staff,
            })

        }catch(err){
            return res.status(500).send({
                status: false,
                message: err.message,
            })
        }
    }


    //Update staff details router constroller
    const updatestaff = async ( req, res) =>{

        try{

            const staffID = req.params.id;
            const{staffName,staffEmail,staffContactNo,staffAddress,staffAge,staffGender,staffSalaryPerHours,staffWorkedHours,staffPassword,staffRole } = req.body;

            const existingstaff = {
                staffName:staffName,
                staffEmail:staffEmail,
                staffContactNo:staffContactNo,
                staffAddress:staffAddress,
                staffAge:staffAge,
                staffGender:staffGender,
                staffSalaryPerHours:staffSalaryPerHours,
                staffWorkedHours:staffWorkedHours,
                staffPassword:staffPassword,
                staffRole:staffRole,

            }

            const updatestaffObj = await staffModel.findByIdAndUpdate(staffID, existingstaff);

            return res.status(200).send({
                status: true,
                message: 'Staff Data Updated',
            })

            }catch(err){
                return res.status(500).send({
                    status: false,
                    message: err.message,
                })
            }
        }

        //Delete staff router controller
        const deletestaff = async (req, res) =>{

            try{

                const staffID = req.params.id;
                const delstaff = await staffModel.findByIdAndDelete(staffID);

                return res.status(200).send({
                    status:true,
                    message: 'Staff Details Deleted',
                })
            }catch(err){
                return res.status(500).send({
                    status: false,
                    message: err.message,
                })
            }
        }

        // Function to generate and serve the PDF invoice
const staffGenerateInvoice = async (req, res) => {
    try {
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/staff-invoice-template.html'), 'utf-8');
        // console.log(htmlTemplate);
       
        const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
        const filename = 'Staff_Management_' + timestamp + '_doc' + '.pdf';
     
        const staff = await staffModel.find({});
        // console.log("items : ", items);

        let staffArray = [];

        staff.forEach(i => {
            const totalSalary = i.staffSalaryPerHours * i.staffWorkedHours; // Calculate total price for each item
            const it = {
                staffName: i.staffName,
                staffContactNo: i.staffContactNo,
                staffSalaryPerHours: i.staffSalaryPerHours,
                staffWorkedHours: i.staffWorkedHours,
                totalSalary: totalSalary // Include the total price in the item object
            }
            staffArray.push(it);
        })
       
        // Calculate the total amount by reducing the items array
        const grandTotal = staffArray.reduce((total, staff) => total + staff.totalSalary, 0); //0: This is the initial value of total. In this case, it starts at 0.

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
                staffArray,
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


        //get - search particular item
        const searchStaff = async (req, res) => {

            try{
       
                const staffName = req.query.staffName;
                // Using a regular expression to match partial game names
                const staff = await staffModel.find({ staffName: { $regex: `^${staffName}`, $options: 'i' } }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.
       
                return res.status(200).send({
                    status: true,
                    message: "✨ :: Project Searched and fetched!",
                    searchedStaff: staff
                })
       
            }catch(err){
       
                return res.status(500).send({
                    status: false,
                    message: err.message
                });
       
            }
       
        }

        module.exports = {
            addstaff,
            getAllstaff,
            getOnestaff,
            updatestaff,
            deletestaff,
            searchStaff,
            StaffLogin,
            staffGenerateInvoice,
        }