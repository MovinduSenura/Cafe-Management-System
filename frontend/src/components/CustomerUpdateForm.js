//logics functions hdnna use krnne react
import React, { useEffect, useState } from "react";

//import axios
import axios from 'axios';

//importing css file
//import './CustomerUpdateForm.css'
import './UpdateForm.css'
import { useParams, useNavigate} from "react-router-dom";


const CustomerUpdateForm = () => {
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
        const navigate = useNavigate();

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

        const updateData = (e) => {
                //e means event. when we press submit the page get refreshed. yta mkwat ewa wen na. ewa wenna pddk wela ynw. ehema refresh wena eka nwttnna thma preventdefault kyl dnne.
                e.preventDefault();

                //in controller all data are moved to the red part in create form req part.So here data in our form is
                //caught and stored in left side things

                try{
                        let updateCustomerData = {
                                customerFullName: customerFullName,
                                customerEmail: customerEmail,
                                customerContactNo: customerContactNo,
                                customerNIC: customerNIC,
                                customerGender: customerGender,
                                customerAddress: customerAddress,
                                customerLoyaltyPoints: customerLoyaltyPoints,
                                 //take the data in form and transfer them to model. model eke req.bosy ekt harha thyena tikt thmai assign wenne
                        }

                        //axios thmai uda thyena object eka backend ekt arn ynne post req ekkin
                        //axios eken parameters dekak pass krnw. mulinma pass krnne link eka(route url eka). eelgata pass krnne api uda hdgtta object eka(newCustomerData)
                        axios.patch(`http://localhost:8000/customer/customerUpdate/${id}`, updateCustomerData)
                        //take the res from backend if above all are sucessful. backend eken gnne then ekedi.
                        .then((res) => {
                               
                                //console is used beacuse no html is used here
                                console.log(res.data.status);
                                console.log(res.data.message);
                                alert("Customer updated");
                                navigate('/customersall')
                                

                        })
                        //this catch works if axios work but response is not obtained from backend. so we can check whether there are erros is two paras of axios using catch
                        .catch((err) => {
                                console.log("❌ :: Error on API or updateCustomerData object : "+ err.message);
                                //err.message kynne catch ken allagnna error eka methndi penanne. backend eke ena ewa newe
                        })
                }catch(err){
                        console.log("❌ :: sendData function failed! Error : "+ err.message);

                }
        }
        return (
                //dynamic ekaka function wda kennoni
                //only one div is inside return. but many divs can be inside devs.
                <div className="updateFormContainer">

                        <div className="updateformBootstrap">
                        
                                <h2>Update Form</h2>

                                <form onSubmit={updateData}>

                                
                                        {/* onchange is used to store all values letter by letter */}
                                        <div className="form-group mb-3">
                                                <label for="fullName">Full Name:</label>
                                                <input type="text" className="form-control" id="fullName" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Full Name" onChange={
                                                        (e) => {
                                                            setcustomerFullName(e.target.value)
                                                        }
                                                } value={customerFullName}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="email">Email:</label>
                                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Email" onChange={
                                                        (e) => {
                                                            setcustomerEmail(e.target.value)
                                                        }
                                                 } value={customerEmail}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="contactNo">Contact No:</label>
                                                <input type="text" className="form-control" id="contactNo" aria-describedby="emailHelp" autoComplete="off" placeholder="071 5678987" onChange={
                                                        (e) => {
                                                            setcustomerContactNo(e.target.value)
                                                        }
                                                 } value={customerContactNo}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="nic">NIC:</label>
                                                <input type="text" className="form-control" id="nic" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter NIC" onChange={
                                                        (e) => {
                                                            setcustomerNIC(e.target.value)
                                                        }
                                                 } value={customerNIC}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="gender">Gender:</label>
                                                <input type="text" className="form-control" id="gender" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Gender" onChange={
                                                        (e) => {
                                                            setcustomerGender(e.target.value)
                                                        }
                                                 } value={customerGender}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="address">Address:</label>
                                                <input type="text" className="form-control" id="address" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Address" onChange={
                                                        (e) => {
                                                            setcustomerAddress(e.target.value)
                                                        }
                                                 } value={customerAddress} />

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="loyaltyPoints">Loyalty Points:</label>
                                                <input type="number" className="form-control" id="loyaltyPoints" aria-describedby="emailHelp" autoComplete="off" min={0} placeholder="Enter Loyalty Points" onChange={
                                                        (e) => {
                                                                setcustomerLoyaltyPoints(e.target.value)
                                                        }
                                                 }value={customerLoyaltyPoints} />

                                        </div>


                                        <div className="updatebtndiv">
                                        <button type="submit" className="btn btn-primary submitbtn">Update</button>
                                        </div>
                                        

                                </form>
                        </div>


                </div>
        )
};

export default CustomerUpdateForm;
