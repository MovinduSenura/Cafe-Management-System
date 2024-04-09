import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import './CreateOrderForm.css'

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
    <div className="CreateOrderFormContainer">
      <div className="orderFormContainer">
        <h1>Add Order</h1>

        <form onSubmit={updateData}>
          <div class="form-group mb-3">
            <label for="Order_name">Order-Name</label>
            <input
              type="text"
              class="form-control"
              id="Order_name"
              placeholder="Choose Order Items"
              onChange={(e) => setOrderName(e.target.value)}
              value={OrderName}
            />
          </div>

          <div class="form-group mb-3">
            <label for="Order_quantity">Quantity</label>
            <input
              type="number"
              class="form-control"
              id="Order_quantity"
              placeholder="Choose the quantity"
              onChange={(e) => setOrderQuantity(e.target.value)}
              value={OrderQuantity}
            />
          </div>

          <div class="form-group mb3">
            <label for="Order_amount">Full-Amount</label>
            <input
              type="number"
              class="form-control"
              id="AmountExample"
              placeholder="Choose the amount"
              onChange={(e) => setOrderPrice(e.target.value)}
              value={OrderPrice}
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderUpdateForm;
