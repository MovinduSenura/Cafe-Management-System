import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
//import CSS files
import './PaymentCreateForm.css'

const PaymentUpdateForm = () => {

    const [orderID, setorderID] = useState('');
    const [promotionID, setpromotionID] = useState('');
    const [amount, setamount] = useState('');
    const [date, setdate] = useState('');

    //using useParams we catching id from URL and assign it to id const
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        
        const getOneData = async () => {
            try{

                await axios.get(`http://localhost:8000/payment/getOne/${id}`)
                .then((res) => {
                    setorderID(res.data.payment.orderID);
                    setpromotionID(res.data.payment.promotionID);
                    setamount(res.data.payment.amount);
                    setdate(res.data.payment.date); 
                    console.log("🌟 :: Payment details fetched successfully!");

                }).catch((err) => {
                    console.log("💀 :: Error on API URL : "+err.message);
                })

            }catch(err){
                    console.log("💀 :: getOneData function failed! ERROR : "+err.message);
            }
        }

        getOneData();
    },[id])

    const updateData = (e) => {
        e.preventDefault();

        try{
            let updatePayment = {
                orderID: orderID,
                promotionID: promotionID,
                amount: amount,
                date: date,
            }

            axios.patch(`http://localhost:8000/payment/updatePayment/${id}`,updatePayment)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
                navigate('/getAllPayment')
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
                <h1>Update Payment</h1>
                <form onSubmit={updateData}>
            <div className="form-group mb-3">
                <label for="orderID">Order ID: </label>
                <input type="text" className="form-control" id="orderID" placeholder="orderID" autoComplete="off" onChange={
                        (e) => {
                            setorderID(e.target.value) 
                        }
                        } value={orderID}/>
            </div>
            <div className="form-group mb-3">
                <label for="promotionID">Promotion ID: </label>
                <input type="text" className="form-control" id="promotionID" placeholder="promoID" autoComplete="off" onChange={
                        (e) => {
                            setpromotionID(e.target.value) 
                        }
                        } value={promotionID}/>
            </div>
            <div className="form-group mb-3">
                <label for="amount">Amount: </label>
                <input type="Number" className="form-control" id="amount" placeholder="amount" autoComplete="off" onChange={
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
            <div className="submitbtndiv">
            <button type="submit" className="btn btn-primary">Update</button>
            </div>
            </form>
            </div>
            
                    </div>
        

   
    ) 
};

export default PaymentUpdateForm;