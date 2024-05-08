//logics functions hdnna use krnne react
import React, { useEffect, useState } from "react";

//import axios
import axios from 'axios';
import './UpdateForm.css'

//importing css file
//import './CustomerUpdateForm.css'
import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const CustomerOneForm = () => {
        //sending data to backend
        //catching data from backend
        //between function and return

        const[customerFullName, setcustomerFullName] = useState(" ");
        const[customerEmail, setcustomerEmail] = useState(" ");
        const[customerContactNo, setcustomerContactNo] = useState(" ");
        const[customerNIC, setcustomerNIC] = useState(" ");
        const[customerGender, setcustomerGender] = useState(" ");
        const[customerAddress, setcustomerAddress] = useState(" ");
        const[customerLoyaltyPoints, setcustomerLoyaltyPoints] = useState(" ");
        //customerFullName = " ", when starting it is set

        //useEffect wge react-router-dom lage ekk. useparams walin krnne me page ekt enakot link eke thyena id eka arn id ekt save krnw
        const { id } = useParams();

        useEffect(() => {

            //This function is created to get data related to one customer
            const getOneItem = async () => {
                try{

                    await axios.get(`http://localhost:8000/customer/customer/${id}`)
                    .then((res) => {
                        setcustomerFullName(res.data.Customer.customerFullName);
                        setcustomerEmail(res.data.Customer.customerEmail);
                        setcustomerContactNo(res.data.Customer.customerContactNo);
                        setcustomerNIC(res.data.Customer.customerNIC);
                        setcustomerGender(res.data.Customer.customerGender);
                        setcustomerAddress(res.data.Customer.customerAddress);
                        setcustomerLoyaltyPoints(res.data.Customer.customerLoyaltyPoints);
                        console.log("⭐⭐ :: Customer fetched successfully")
                        // Controller ekedi hdpu rathu Customer eka hrha okkoma attributes set krgnnw
                    })
                    .catch((err) => {
                        console.log("❌ :: Error on API URL : " + err.message);
                    })

                }catch (err){
                    console.log("❌ :: getOneItem failed ERROR : " + err.message);
                }
            }

            getOneItem();
        },[id])
        //above[] states no. of times useEffect runs.
        //the variables created outside the function are stated inside [] above. e eeke wdya.

        //Delete
    // const handleDelete = async (id) => {
           
    //     try {

    //         const confirmed = window.confirm("Are you want to delete this customer??");

    //         if (confirmed) {

                
    //             await axios.delete(`http://localhost:8000/customer/customerdelete/${id}`)
    //                 .then((res) => {
    //                     alert(res.data.message);
    //                     console.log(res.data.message);
    //                 })
    //                 .catch((err) => {
    //                     console.log("❌ :: Error on API URL : " + err.message);
    //                 })


    //         } else {
    //             toast.error('Deletion Cancelled!',{
    //                 position: "top-center",
    //             });
    //             console.log("Deletion Cancelled!")
    //         }




    //     } catch (err) {
    //         console.log("❌ :: handleDelete function failed! ERROR : " + err.message);
    //     }



    // }


        return (
            //dynamic ekaka function wda kennoni
            //only one div is inside return. but many divs can be inside devs.
            <div className="updateFormContainer">

                    <div className="updateformBootstrap">
                    
                     {/* can put in anyplace within main div */}
            {/* <ToastContainer/> */}
                            
                            <form>                                    {/* onchange is used to store all values letter by letter */}
                                    <div className="form-group mb-3">
                                            <label for="fullName">Full Name:</label>
                                            <input type="text" className="form-control" id="fullName" aria-describedby="emailHelp" placeholder="Enter Full Name" onChange={
                                                    (e) => {
                                                        setcustomerFullName(e.target.value)
                                                    }
                                            } value={customerFullName} disabled/>

                                    </div>

                                    <div className="form-group mb-3">
                                            <label for="email">Email:</label>
                                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter Email" onChange={
                                                    (e) => {
                                                        setcustomerEmail(e.target.value)
                                                    }
                                             } value={customerEmail} disabled/>

                                    </div>

                                    <div className="form-group mb-3">
                                            <label for="contactNo">Contact No:</label>
                                            <input type="tel" className="form-control" id="contactNo" aria-describedby="emailHelp" placeholder="071 5678987" pattern="[0-9]{3}[0-9]{7}" onChange={
                                                    (e) => {
                                                        setcustomerContactNo(e.target.value)
                                                    }
                                             } value={customerContactNo} disabled/>

                                    </div>

                                    <div className="form-group mb-3">
                                            <label for="nic">NIC:</label>
                                            <input type="text" className="form-control" id="nic" aria-describedby="emailHelp" placeholder="Enter NIC" onChange={
                                                    (e) => {
                                                        setcustomerNIC(e.target.value)
                                                    }
                                             } value={customerNIC} disabled/>

                                    </div>

                                    <div className="form-group mb-3">
                                            <label for="gender">Gender:</label>
                                            <input type="text" className="form-control" id="gender" aria-describedby="emailHelp" placeholder="Enter Gender" onChange={
                                                    (e) => {
                                                        setcustomerGender(e.target.value)
                                                    }
                                             } value={customerGender} disabled/>

                                    </div>

                                    <div className="form-group mb-3">
                                            <label for="address">Address:</label>
                                            <input type="text" className="form-control" id="address" aria-describedby="emailHelp" placeholder="Enter Address" onChange={
                                                    (e) => {
                                                        setcustomerAddress(e.target.value)
                                                    }
                                             } value={customerAddress} disabled/>

                                    </div>

                                    <div className="form-group mb-3">
                                            <label for="loyaltyPoints">Loyalty Points:</label>
                                            <input type="number" className="form-control" id="loyaltyPoints" aria-describedby="emailHelp" placeholder="Enter Loyalty Points" onChange={
                                                    (e) => {
                                                            setcustomerLoyaltyPoints(e.target.value)
                                                    }
                                             }value={customerLoyaltyPoints} disabled/>

                                    </div>

                                    <button type="button" className="btn btn-primary addItemBtn">Download Invoice</button>
 {/* onClick={downloadInvoice} Download Invoice </button> */}


                                    {/* <div style={{textAlign: "center"}} className="onecusbtns">
                                        <Link to = {`/CustomerUpdate/${id}`}>
                                            <button type="button" class="btn btn-success">Edit</button></Link>&nbsp;&nbsp;
                                            <button type="button" class="btn btn-danger" onClick={() => handleDelete(id)}>Delete</button>
                                    </div> */}

                                    

                            </form>
                    </div>


            </div>
    )
};

export default CustomerOneForm;
