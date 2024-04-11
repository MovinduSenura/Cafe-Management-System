//logics functions hdnna use krnne react
import React, {useState} from "react";

//import axios
import axios from 'axios';

//importing css file
import './CustomerCreateForm.css'


const CustomerCreateForm = () => {
        //sending data to backend
        //catching data from backend
        //between function and return

        const[customerFullName, setcustomerFullName] = useState("");
        const[customerEmail, setcustomerEmail] = useState("");
        const[customerContactNo, setcustomerContactNo] = useState("");
        const[customerNIC, setcustomerNIC] = useState("");
        const[customerGender, setcustomerGender] = useState("");
        const[customerAddress, setcustomerAddress] = useState("");
        const[customerLoyaltyPoints, setcustomerLoyaltyPoints] = useState("");
        //customerFullName = " ", when starting it is set

        //useEffect is useed because first we should get data related to relavant id
        

        const sendData = (e) => {
                //e means event. when we press submit the page get refreshed. yta mkwat ewa wen na. ewa wenna pddk wela ynw. ehema refresh wena eka nwttnna thma preventdefault kyl dnne.
                e.preventDefault();

                //in controller all data are moved to the red part in create form req part.So here data in our form is
                //caught and stored in left side things

                try{
                        let newCustomerData = {
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
                        axios.post('http://localhost:8000/customer/customercreate', newCustomerData)
                        //take the res from backend if above all are sucessful. backend eken gnne then ekedi.
                        .then((res) => {
                                alert(res.data.message);
                                //console is used beacuse no html is used here
                                console.log(res.data.status);
                                console.log(res.data.message);

                        })
                        //this catch works if axios work but response is not obtained from backend. so we can check whether there are erros is two paras of axios using catch
                        .catch((err) => {
                                console.log("❌ :: Error on API or newCustomerData object : "+ err.message);
                                //err.message kynne catch ken allagnna error eka methndi penanne. backend eke ena ewa newe
                        })

                        //set state back to empty. thatmeans attributes(customerFullName,customerEmail e tika) wala data okkoma ain krla his krnw.
                        setcustomerFullName('');
                        setcustomerEmail('');
                        setcustomerContactNo('');
                        setcustomerNIC('');
                        setcustomerGender('');
                        setcustomerAddress('');
                        setcustomerLoyaltyPoints('');

                }catch(err){
                        console.log("❌ :: sendData function failed! Error : "+ err.message);

                }



        }
        return (
                //dynamic ekaka function wda kennoni
                //only one div is inside return. but many divs can be inside devs.
                <div className="createFormContainer">

                        <div className="formBootsrap">
                        
                                <h3>Customer Registration Form</h3>
                                <form onSubmit={sendData}>

                                
                                        {/* onchange is used to store all values letter by letter */}
                                        <div className="form-group mb-3">
                                                <label for="fullName">Full Name</label>
                                                <input type="text" className="form-control" id="fullName" aria-describedby="emailHelp" placeholder="Enter Full Name" onChange={
                                                        (e) => {
                                                            setcustomerFullName(e.target.value)
                                                        }
                                                } value={customerFullName}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="email">Email</label>
                                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter Email" onChange={
                                                        (e) => {
                                                            setcustomerEmail(e.target.value)
                                                        }
                                                 } value={customerEmail}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="contactNo">Contact No</label>
                                                <input type="text" className="form-control" id="contactNo" aria-describedby="emailHelp" placeholder="071 5678987" onChange={
                                                        (e) => {
                                                            setcustomerContactNo(e.target.value)
                                                        }
                                                 } value={customerContactNo}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="nic">NIC</label>
                                                <input type="text" className="form-control" id="nic" aria-describedby="emailHelp" placeholder="Enter NIC" onChange={
                                                        (e) => {
                                                            setcustomerNIC(e.target.value)
                                                        }
                                                 } value={customerNIC}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="gender">Gender</label>
                                                <input type="text" className="form-control" id="gender" aria-describedby="emailHelp" placeholder="Enter Gender" onChange={
                                                        (e) => {
                                                            setcustomerGender(e.target.value)
                                                        }
                                                 } value={customerGender}/>

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="address">Address</label>
                                                <input type="text" className="form-control" id="address" aria-describedby="emailHelp" placeholder="Enter Address" onChange={
                                                        (e) => {
                                                            setcustomerAddress(e.target.value)
                                                        }
                                                 } value={customerAddress} />

                                        </div>

                                        <div className="form-group mb-3">
                                                <label for="loyaltyPoints">Loyalty Points</label>
                                                <input type="number" className="form-control" id="loyaltyPoints" aria-describedby="emailHelp" placeholder="Enter Loyalty Points" onChange={
                                                        (e) => {
                                                                setcustomerLoyaltyPoints(e.target.value)
                                                        }
                                                 }value={customerLoyaltyPoints} />

                                        </div>


                                        <center><button type="submit" className="btn btn-primary">Register</button></center>

                                </form>
                        </div>


                </div>
        )
};

export default CustomerCreateForm;
