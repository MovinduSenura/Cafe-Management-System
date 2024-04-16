const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const staffModel = require("../models/staff.model");
const express = require('express');
const router = express.Router();

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

            return res.status(200).send({
                status: true,
                message:"✨ :: All items are fetched",
                AllStaff: allstaff,
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
        }



    
