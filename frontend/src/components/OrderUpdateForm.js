import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import './UpdateForm.css';

const OrderUpdateForm = () => {
  //   return (
  //     <div>OrderUpdateForm</div>
  //   )

  const [OrderName, setOrderName] = useState("");
  const [OrderQuantity, setOrderQuantity] = useState("");
  const [OrderPrice, setOrderPrice] = useState("");

  //using useParams to catch the id from url and assign it to the id
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getOneData = async () => {
      try {
        await axios
          .get(`http://localhost:8000/order/oneOrder/${id}`)
          .then((res) => {
            setOrderName(res.data.order.OrderName);
            setOrderQuantity(res.data.order.OrderQuantity);
            setOrderPrice(res.data.order.OrderPrice);
            console.log("✨ :: Item fetched successfully!");
          })

          .catch((err) => {
            console.log("💀 :: Error on API URL : " + err.message);
          });
      } catch (err) {
        console.log(
          "💀 :: Get one data function failed! Error : " + err.message
        );
      }
    };

    getOneData();
  }, [id]);

  const updateData = (e) => {
    e.preventDefault();

    try {
      let updateOrderItem = {
        OrderName: OrderName,
        OrderQuantity: OrderQuantity,
        OrderPrice: OrderPrice,
      };

      axios
        .patch(`http://localhost:8000/order/Update/${id}`, updateOrderItem)
        .then((res) => {
          alert(res.data.message);
          console.log(res.data.status);
          console.log(res.data.message);
          navigate("/OrdersAll");
        })
        .catch((err) => {
          console.log(
            "💀 :: Error on API URL or updateOrderItem object  : " + err.message
          );
        });
    } catch (err) {
      console.log("💀 :: updateData Function failed Error : " + err.message);
    }
  };

  return (
    <div className="updateFormContainer" style={{marginBottom: "109px", marginTop: "190px"}}>
      <div className="updateformBootstrap">
        <h2>Updtae Order Details</h2>

        <form onSubmit={updateData}>
          <div class="form-group mb-3">
            <label for="Order_name">Order Name:</label>
            <input
              type="text"
              class="form-control"
              id="Order_name"
              placeholder="Choose Order Items"
              autoComplete="off"
              onChange={(e) => setOrderName(e.target.value)}
              value={OrderName}
            />
          </div>

          <div class="form-group mb-3">
            <label for="Order_quantity">Quantity:</label>
            <input
              type="number"
              class="form-control"
              id="Order_quantity"
              placeholder="Choose the quantity"
              autoComplete="off"
              min={0}
              onChange={(e) => setOrderQuantity(e.target.value)}
              value={OrderQuantity}
            />
          </div>

          <div class="form-group mb3">
            <label for="Order_amount">Full Amount(Rs):</label>
            <input
              type="number"
              class="form-control"
              id="AmountExample"
              placeholder="Choose the amount"
              autoComplete="off"
              min={0}
              onChange={(e) => setOrderPrice(e.target.value)}
              value={OrderPrice}
            />
          </div>

          <div style={{marginTop: "20px"}} className="updatebtndiv">
          <button type="submit" class="btn btn-primary submitbtn">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderUpdateForm;
