import React, { useState } from "react";
import axios from 'axios';
import './CreateForm.css'



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
// //logics functions hdnna use krnne react
// import React, {useState} from "react";

// //import axios
// import axios from 'axios';

// //importing css file
// //import './CustomerCreateForm.css'
// import './CreateForm.css'


// const CustomerCreateForm = () => {
//         //sending data to backend
//         //catching data from backend
//         //between function and return

//         const[customerFullName, setcustomerFullName] = useState("");
//         const[customerEmail, setcustomerEmail] = useState("");
//         const[customerContactNo, setcustomerContactNo] = useState("");
//         const[customerNIC, setcustomerNIC] = useState("");
//         const[customerGender, setcustomerGender] = useState("");
//         const[customerAddress, setcustomerAddress] = useState("");
//         const[customerLoyaltyPoints, setcustomerLoyaltyPoints] = useState("");
//         //customerFullName = " ", when starting it is set

//         //useEffect is useed because first we should get data related to relavant id
        

//         const sendData = (e) => {
//                 //e means event. when we press submit the page get refreshed. yta mkwat ewa wen na. ewa wenna pddk wela ynw. ehema refresh wena eka nwttnna thma preventdefault kyl dnne.
//                 e.preventDefault();

//                 //in controller all data are moved to the red part in create form req part.So here data in our form is
//                 //caught and stored in left side things

//                 try{
//                         let newCustomerData = {
//                                 customerFullName: customerFullName,
//                                 customerEmail: customerEmail,
//                                 customerContactNo: customerContactNo,
//                                 customerNIC: customerNIC,
//                                 customerGender: customerGender,
//                                 customerAddress: customerAddress,
//                                 customerLoyaltyPoints: customerLoyaltyPoints,
//                                  //take the data in form and transfer them to model. model eke req.bosy ekt harha thyena tikt thmai assign wenne
//                         }

//                         //axios thmai uda thyena object eka backend ekt arn ynne post req ekkin
//                         //axios eken parameters dekak pass krnw. mulinma pass krnne link eka(route url eka). eelgata pass krnne api uda hdgtta object eka(newCustomerData)
//                         axios.post('http://localhost:8000/customer/customercreate', newCustomerData)
//                         //take the res from backend if above all are sucessful. backend eken gnne then ekedi.
//                         .then((res) => {
//                                 alert(res.data.message);
//                                 //console is used beacuse no html is used here
//                                 console.log(res.data.status);
//                                 console.log(res.data.message);

//                         })
//                         //this catch works if axios work but response is not obtained from backend. so we can check whether there are erros is two paras of axios using catch
//                         .catch((err) => {
//                                 console.log("❌ :: Error on API or newCustomerData object : "+ err.message);
//                                 //err.message kynne catch ken allagnna error eka methndi penanne. backend eke ena ewa newe
//                         })

//                         //set state back to empty. thatmeans attributes(customerFullName,customerEmail e tika) wala data okkoma ain krla his krnw.
//                         setcustomerFullName('');
//                         setcustomerEmail('');
//                         setcustomerContactNo('');
//                         setcustomerNIC('');
//                         setcustomerGender('');
//                         setcustomerAddress('');
//                         setcustomerLoyaltyPoints('');

//                 }catch(err){
//                         console.log("❌ :: sendData function failed! Error : "+ err.message);

//                 }



//         }
//         return (
//                 //dynamic ekaka function wda kennoni
//                 //only one div is inside return. but many divs can be inside devs.
//                 <div className="createFormContainer">

//                         <div className="formBootstrap">
                        
//                                 <h2>Customer Registration Form</h2>
//                                 <form onSubmit={sendData}>

                                
//                                         {/* onchange is used to store all values letter by letter */}
//                                         <div className="form-group mb-3">
//                                                 <label for="fullName">Full Name:</label>
//                                                 <input type="text" className="form-control" id="fullName" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Full Name" onChange={
//                                                         (e) => {
//                                                             setcustomerFullName(e.target.value)
//                                                         }
//                                                 } value={customerFullName}/>

//                                         </div>

//                                         <div className="form-group mb-3">
//                                                 <label for="email">Email:</label>
//                                                 <input type="email" className="form-control" id="email" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Email" onChange={
//                                                         (e) => {
//                                                             setcustomerEmail(e.target.value)
//                                                         }
//                                                  } value={customerEmail}/>

//                                         </div>

//                                         <div className="form-group mb-3">
//                                                 <label for="contactNo">Contact No:</label>
//                                                 <input type="tel" className="form-control" id="contactNo" aria-describedby="emailHelp" autoComplete="off" placeholder="071 5678987" onChange={
//                                                         (e) => {
//                                                             setcustomerContactNo(e.target.value)
//                                                         }
//                                                  } value={customerContactNo}/>

//                                         </div>

//                                         <div className="form-group mb-3">
//                                                 <label for="nic">NIC:</label>
//                                                 <input type="text" className="form-control" id="nic" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter NIC" onChange={
//                                                         (e) => {
//                                                             setcustomerNIC(e.target.value)
//                                                         }
//                                                  } value={customerNIC}/>

//                                         </div>

//                                         <div className="form-group mb-3">
//                                                 <label for="gender">Gender:</label>
//                                                 <input type="text" className="form-control" id="gender" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Gender" onChange={
//                                                         (e) => {
//                                                             setcustomerGender(e.target.value)
//                                                         }
//                                                  } value={customerGender}/>

//                                         </div>

//                                         <div className="form-group mb-3">
//                                                 <label for="address">Address:</label>
//                                                 <input type="text" className="form-control" id="address" aria-describedby="emailHelp" autoComplete="off" placeholder="Enter Address" onChange={
//                                                         (e) => {
//                                                             setcustomerAddress(e.target.value)
//                                                         }
//                                                  } value={customerAddress} />

//                                         </div>

//                                         <div className="form-group mb-3">
//                                                 <label for="loyaltyPoints">Loyalty Points:</label>
//                                                 <input type="number" className="form-control" id="loyaltyPoints" aria-describedby="emailHelp" autoComplete="off" min={0} placeholder="Enter Loyalty Points" onChange={
//                                                         (e) => {
//                                                                 setcustomerLoyaltyPoints(e.target.value)
//                                                         }
//                                                  }value={customerLoyaltyPoints} />

//                                         </div>

//                                         <div className="submitbtndiv">
//                                         <button type="submit" className="btn btn-primary submitbtn">Register</button>
//                                         </div>

//                                 </form>
//                         </div>


//                 </div>
//         )
// };

// export default CustomerCreateForm;
