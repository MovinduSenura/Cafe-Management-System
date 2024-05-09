import React, { useEffect, useState } from "react";
import axios from 'axios';
import './UpdateForm.css'
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const CustomerOneForm = () => {
    const [customerFullName, setcustomerFullName] = useState("");
    const [customerEmail, setcustomerEmail] = useState("");
    const [customerContactNo, setcustomerContactNo] = useState("");
    const [customerNIC, setcustomerNIC] = useState("");
    const [customerGender, setcustomerGender] = useState("");
    const [customerAddress, setcustomerAddress] = useState("");
    const [customerLoyaltyPoints, setcustomerLoyaltyPoints] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const getOneItem = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/customer/customer/${id}`);
                const customerData = res.data.Customer;
                setcustomerFullName(customerData.customerFullName);
                setcustomerEmail(customerData.customerEmail);
                setcustomerContactNo(customerData.customerContactNo);
                setcustomerNIC(customerData.customerNIC);
                setcustomerGender(customerData.customerGender);
                setcustomerAddress(customerData.customerAddress);
                setcustomerLoyaltyPoints(customerData.customerLoyaltyPoints);
                console.log("⭐⭐ :: Customer fetched successfully");
            } catch (err) {
                console.log("❌ :: Error on API URL : " + err.message);
            }
        };

        getOneItem();
    }, [id]);

    const getCustomerStatus = (loyaltyPoints) => {
        if (loyaltyPoints > 150) {
            return "Gold Customer";
        } else if (loyaltyPoints > 100) {
            return "Platinum Customer";
        } else if (loyaltyPoints > 50) {
            return "Silver Customer";
        } else {
            return "Regular Customer";
        }
    };

    const getStatusColor = (loyaltyPoints) => {
        if (loyaltyPoints > 150) {
            return "gold";
        } else if (loyaltyPoints > 100) {
            return "blue";
        } else if (loyaltyPoints > 50) {
            return "silver";
        } else {
            return "black";
        }
    };

    console.log("Customer Status:" + getCustomerStatus(parseInt(customerLoyaltyPoints)));
    console.log("Status Color is:" +getStatusColor(parseInt(customerLoyaltyPoints)));

    return (
        <div className="updateFormContainer">

            <div className="updateformBootstrap">

                {/* <div style={{ textAlign: 'center', marginBottom: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', color: getStatusColor(parseInt(customerLoyaltyPoints)), padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)' }}>
                    <b>{getCustomerStatus(parseInt(customerLoyaltyPoints))}</b>
                </div> */}

                <form>
                    <div className="form-group mb-3">
                        <label htmlFor="fullName">Full Name:</label>
                        <input type="text" className="form-control" id="fullName" placeholder="Enter Full Name" value={customerFullName} disabled />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter Email" value={customerEmail} disabled />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="contactNo">Contact No:</label>
                        <input type="tel" className="form-control" id="contactNo" placeholder="071 5678987" pattern="[0-9]{3}[0-9]{7}" value={customerContactNo} disabled />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="nic">NIC:</label>
                        <input type="text" className="form-control" id="nic" placeholder="Enter NIC" value={customerNIC} disabled />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="gender">Gender:</label>
                        <input type="text" className="form-control" id="gender" placeholder="Enter Gender" value={customerGender} disabled />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="address">Address:</label>
                        <input type="text" className="form-control" id="address" placeholder="Enter Address" value={customerAddress} disabled />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="loyaltyPoints">Loyalty Points:</label>
                        <input type="number" className="form-control" id="loyaltyPoints" placeholder="Enter Loyalty Points" value={customerLoyaltyPoints} disabled />

                    </div>

                    <div style={{ textAlign: "center" }} className="onecusbtns">
                        <Link to={`/CustomerUpdate/${id}`}>
                            <button type="button" className="btn btn-success">Edit</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerOneForm;
