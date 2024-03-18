import React, { useState } from "react";
import axios from 'axios';
//import CSS files
import './PaymentCreateForm.css'

const PaymentCreateForm = () => {

    const [orderID, setorderID] = useState('');
    const [promotionID, setpromotionID] = useState('');
    const [amount, setamount] = useState('');
    const [date, setdate] = useState('');

    const sendData = (e) => {
        e.preventDefault();

        try{
            let newPaymentData = {
                orderID: orderID,
                promotionID: promotionID,
                amount: amount,
                date: date,
            }

            axios.post('http://localhost:8000/payment/create',newPaymentData)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
            })
            .catch((err) => {
                console.log("💀 :: Error on API URL or newPaymentData object : "+err.message);
            })

            setorderID('');
            setpromotionID('');
            setamount('');
            setdate('');                                                                      
        }catch(err){
            console.log("💀 :: sendData function failed! ERROR : "+err.message);
        }
    }


    return(

        <div className="PaymentformContainer">
            <div className="formBootstrap">
                <h1>Add Payment</h1>
                <form onSubmit={sendData}>
            <div className="form-group mb-3">
                <label for="orderID">Order ID: </label>
                <input type="text" className="form-control" id="orderID" placeholder="orderID" onChange={
                        (e) => {
                            setorderID(e.target.value) 
                        }
                        } value={orderID}/>
            </div>
            <div className="form-group mb-3">
                <label for="promotionID">Promotion ID: </label>
                <input type="text" className="form-control" id="promotionID" placeholder="promoID" onChange={
                        (e) => {
                            setpromotionID(e.target.value) 
                        }
                        } value={promotionID}/>
            </div>
            <div className="form-group mb-3">
                <label for="amount">Amount: </label>
                <input type="Number" className="form-control" id="amount" placeholder="amount" onChange={
                        (e) => {
                            setamount(e.target.value) 
                        }
                        } value={amount}/>
            </div>
            <div className="form-group mb-3">
                <label for="date">Date: </label>
                <input type="date" className="form-control" id="date"onChange={
                        (e) => {
                            setdate(e.target.value) 
                        }
                        } value={date}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>
            </div>
        

   
    ) 
};

export default PaymentCreateForm;