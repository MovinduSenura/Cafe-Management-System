import React, { useState } from "react";
import axios from 'axios';

import './CreateForm.css';

const CreateOrderForm = () => {

    const[OrderName,setOrderName] = useState('');
    const[OrderQuantity,setOrderQuantity] = useState('');
    const[OrderPrice,setOrderPrice] = useState('');

    const sendData = (e) => {
        e.preventDefault();
    
        try {
            let newOrderData = {
                OrderName: OrderName,  // Do not put the useState functions from the newOrderData object directly use the state variables
                OrderQuantity: OrderQuantity,
                OrderPrice: OrderPrice,
            }
    
            axios.post('http://localhost:8000/order/create', newOrderData)
                .then((res) => {
                    alert(res.data.message);
                    console.log(res.data.status);
                    console.log(res.data.message);
                })
                .catch((err) => {
                    console.log("💀 :: Error on api url or CreateOrderForm object : " + err.message);
                })
    
            // Set state back to initial values
            setOrderName('');
            setOrderQuantity('');
            setOrderPrice('');
    
        } catch (error) {
            console.log("💀 :: Error on axios request: " + error.message);
        }
    }
    
    
  return (

    <div className="createFormContainer" style={{marginBottom: "109px", marginTop: "190px"}}>

        <div className="formBootstrap">
            <h2>Add Order</h2>

    <form onSubmit={sendData}>
  <div class="form-group mb-3">
    <label for="Order_name">Order Name:</label>
        <input type="text" class="form-control" id="Order_name" placeholder="Choose Order Items" autoComplete="off" onChange={(e)=>setOrderName(e.target.value)} value={OrderName} />
    </div>

    <div class="form-group mb-3">
    <label for="Order_quantity">Quantity:</label>
        <input type="number" class="form-control" id="Order_quantity" placeholder="Choose the quantity" autoComplete="off" min={0} onChange={(e)=>setOrderQuantity(e.target.value)} value={OrderQuantity} />
    </div>

    <div class="form-group mb3">
    <label for="Order_amount">Full Amount(Rs):</label>
        <input type="number" class="form-control" id="AmountExample"  placeholder="Choose the amount" autoComplete="off" min={0} onChange={(e)=>setOrderPrice(e.target.value)} value={OrderPrice}  />
    </div>
    <div style={{marginTop: "20px"}} className="submitbtndiv">
    <button type="submit" class="btn btn-primary submitbtn">Place Order</button>
    </div>
</form>

    </div>
    </div>

    
  )
}

export default CreateOrderForm