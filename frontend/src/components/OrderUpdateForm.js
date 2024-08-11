import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";//useParams is used to capture values from the url which can be used to further personalize or specify what to render in the particular view

import './UpdateForm.css';

const OrderUpdateForm = () => {
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/menu/menuItems`);
        setAllMenuItems(response.data.AllmenuItems);
      } catch (err) {
        console.log("💀 :: Error fetching menu items: " + err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getOneData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/order/oneOrder/${id}`);
        const items = response.data.order.menuItems;
        setSelectedItems(items);
        const price = items.reduce((acc, item) => acc + item.menuItemPrice, 0);
        setTotalPrice(price);
        console.log("✨ :: Item fetched successfully!");
      } catch (err) {
        console.log("💀 :: Get one data function failed! Error : " + err.message);
      }
    };

    getOneData();
  }, [id]);

  const handleItemChange = (itemId, isChecked) => {
    const selectedItem = allMenuItems.find(item => item._id === itemId);
    if (isChecked) {
      setSelectedItems([...selectedItems, selectedItem]);
      setTotalPrice(totalPrice + selectedItem.menuItemPrice);
    } else {
      const updatedItems = selectedItems.filter(item => item._id !== itemId);
      setSelectedItems(updatedItems);
      setTotalPrice(totalPrice - selectedItem.menuItemPrice);
    }
  };

  const updateData = async (e) => {
    e.preventDefault();
  
    try {
      const updateOrderItem = {
        menuItems: selectedItems, // Pass selectedItems array
        OrderPrice: totalPrice, // Pass totalPrice
      };
  
      const response = await axios.patch(`http://localhost:8000/order/Update/${id}`, updateOrderItem);
      alert(response.data.message);
      console.log(response.data.status);
      console.log(response.data.message);
      navigate("/OrdersAll");
    } catch (err) {
      console.log("💀 :: Update data function failed! Error : " + err.message);
      alert("Failed to update order. Please try again.");
    }
  };
  

  return (
    <div className="updateFormContainer" style={{marginBottom: "109px", marginTop: "190px"}}>
      <div className="updateformBootstrap">
        <h2>Update Order Details</h2>

        <form onSubmit={updateData}>
          <div className="form-group mb-3">
            <label htmlFor="Order_name">Select Menu Items:</label>
            {allMenuItems.map(item => (
              <div key={item._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedItems.some(selectedItem => selectedItem._id === item._id)}
                    onChange={e => handleItemChange(item._id, e.target.checked)}
                  />
                  {item.menuItemName} - {item.menuItemPrice} LKR
                </label>
              </div>
            ))}
          </div>

          <div className="form-group mb3">
            <label htmlFor="Order_amount">Total Amount(Rs):</label>
            <input
              type="text"
              className="form-control"
              id="AmountExample"
              value={totalPrice.toFixed(2)}
              readOnly
            />
          </div>

          <div style={{marginTop: "20px"}} className="updatebtndiv">
            <button type="submit" className="btn btn-primary submitbtn">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderUpdateForm;
