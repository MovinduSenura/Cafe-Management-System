import React, { useState } from "react";
import axios from 'axios';
import emailjs from '@emailjs/browser'; // Import EmailJS library
import './CreateForm.css'

emailjs.init('ZYPYzV_iOjFRxY5RR');

const CustomerCreateForm = () => {
    const [customerFullName, setCustomerFullName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerContactNo, setCustomerContactNo] = useState("");
    const [customerNIC, setCustomerNIC] = useState("");
    const [customerGender, setCustomerGender] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState("");
    const [formErrors, setFormErrors] = useState({});

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const sendData = (e) => {
        e.preventDefault();
        const errors = {};
        if (!customerFullName) {
            errors.customerFullName = "Please enter full name";
        }
        if (!customerEmail) {
            errors.customerEmail = "Please enter email";
        } else if (!emailPattern.test(customerEmail)) {
            errors.customerEmail = "Please enter a valid email address";
        }
        if (!customerContactNo) {
            errors.customerContactNo = "Please enter contact number";
        }
        if (!customerNIC) {
            errors.customerNIC = "Please enter NIC";
        }
        if (!customerGender) {
            errors.customerGender = "Please enter gender";
        }
        if (!customerAddress) {
            errors.customerAddress = "Please enter address";
        }
        if (!customerLoyaltyPoints) {
            errors.customerLoyaltyPoints = "Please enter loyalty points";
        }

        if (Object.keys(errors).length === 0) {
            const newCustomerData = {
                customerFullName,
                customerEmail,
                customerContactNo,
                customerNIC,
                customerGender,
                customerAddress,
                customerLoyaltyPoints
            };

            axios.post('http://localhost:8000/customer/customercreate', newCustomerData)
                .then((res) => {
                    // Send email using EmailJS upon successful registration
                    emailjs.send('service_f3hl5ol', 'template_9t7s17a', {
                        to_name: customerFullName,
                        from_name: 'Espresso Elegance!',
                        message: 'Thank you for registering!',
                        email: customerEmail,
                        contact_no:customerContactNo,
                        nic:customerNIC,
                        gender:customerGender,
                        address:customerAddress,
                        loyalty_points:customerLoyaltyPoints
                    })
                    .then((response) => {
                        console.log('Email sent:', response);
                    })
                    .catch((error) => {
                        console.error('Error sending email:', error);
                    });

                    alert(res.data.message);
                    console.log(res.data.status);
                    console.log(res.data.message);
                })
                .catch((err) => {
                    console.log("❌ :: Error on API or newCustomerData object : " + err.message);
                });

            setCustomerFullName('');
            setCustomerEmail('');
            setCustomerContactNo('');
            setCustomerNIC('');
            setCustomerGender('');
            setCustomerAddress('');
            setCustomerLoyaltyPoints('');
        } else {
            setFormErrors(errors);
        }
    };

    return (
        <div className="createFormContainer">
            <div className="formBootstrap">
                <h2>Customer Registration Form</h2>
                <form onSubmit={sendData}>
                    <div className="form-group mb-3">
                        <label htmlFor="fullName">Full Name:</label>
                        <input type="text" className="form-control" id="fullName" autoComplete="off" placeholder="Enter Full Name" onChange={(e) => setCustomerFullName(e.target.value)} value={customerFullName} />
                        {formErrors.customerFullName && <p className="error-message">{formErrors.customerFullName}</p>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="email" autoComplete="off" placeholder="Enter Email" onChange={(e) => setCustomerEmail(e.target.value)} value={customerEmail} />
                        {formErrors.customerEmail && <p className="error-message">{formErrors.customerEmail}</p>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="contactNo">Contact No:</label>
                        <input type="tel" className="form-control" id="contactNo" autoComplete="off" placeholder="071 5678987" onChange={(e) => setCustomerContactNo(e.target.value)} value={customerContactNo} pattern="[0-9]*" />
                        {formErrors.customerContactNo && <p className="error-message">{formErrors.customerContactNo}</p>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="nic">NIC:</label>
                        <input type="text" className="form-control" id="nic" autoComplete="off" placeholder="Enter NIC" onChange={(e) => setCustomerNIC(e.target.value)} value={customerNIC} />
                        {formErrors.customerNIC && <p className="error-message">{formErrors.customerNIC}</p>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="gender">Gender:</label>
                        <input type="text" className="form-control" id="gender" autoComplete="off" placeholder="Enter Gender" onChange={(e) => setCustomerGender(e.target.value)} value={customerGender} />
                        {formErrors.customerGender && <p className="error-message">{formErrors.customerGender}</p>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="address">Address:</label>
                        <input type="text" className="form-control" id="address" autoComplete="off" placeholder="Enter Address" onChange={(e) => setCustomerAddress(e.target.value)} value={customerAddress} />
                        {formErrors.customerAddress && <p className="error-message">{formErrors.customerAddress}</p>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="loyaltyPoints">Loyalty Points:</label>
                        <input type="number" className="form-control" id="loyaltyPoints" autoComplete="off" min={0} placeholder="Enter Loyalty Points" onChange={(e) => setCustomerLoyaltyPoints(e.target.value)} value={customerLoyaltyPoints} />
                        {formErrors.customerLoyaltyPoints && <p className="error-message">{formErrors.customerLoyaltyPoints}</p>}
                    </div>

                    <div className="submitbtndiv">
                     <button type="submit" className="btn btn-primary submitbtn">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerCreateForm;
