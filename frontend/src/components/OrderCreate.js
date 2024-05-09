import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CreateForm.css'

const OrderCreate = () => {

  const [MenuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false); // State to track order creation status

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/menu/menuItems');
      setMenuItems(response.data.AllmenuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleItemChange = (itemId, isChecked) => {
    const selectedItem = MenuItems.find(item => item._id === itemId);
    if (isChecked) {
      setSelectedItems([...selectedItems, selectedItem]);
      setTotalPrice(totalPrice + selectedItem.menuItemPrice);
    } else {
      const updatedItems = selectedItems.filter(item => item._id !== itemId);
      setSelectedItems(updatedItems);
      setTotalPrice(totalPrice - selectedItem.menuItemPrice);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any menu items are selected before proceeding
    if (selectedItems.length === 0) {
      alert('Please select at least one menu item.');
      return;
    }
    // Proceed with order creation
    setIsCreatingOrder(true); // Set loading state while creating order
    try {
      const response = await axios.post('http://localhost:8000/order/create', {
        MenuitemIds: selectedItems.map(item => item._id),
      });
      setIsCreatingOrder(false); // Reset loading state after order creation
      alert("🍟 Order Created!");
      navigate(`/payment/create/${response.data.Order._id}`);
    } catch (error) {
      setIsCreatingOrder(false); // Reset loading state if order creation fails
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="createFormContainer" style={{marginBottom: "77px", marginTop: "150px"}}>
      <div className="formBootstrap">
        <h2 style={{marginBottom: "20px"}}>Add Menu Items to Order</h2>
        <form onSubmit={handleSubmit}>
          <ul>
            {MenuItems.map(item => (
              <li style={{marginBottom: "10px"}} key={item._id}>
                <label>
                  <input
                    type="checkbox"
                    onChange={e => handleItemChange(item._id, e.target.checked)}
                  />
                  {item.menuItemName} - {item.menuItemPrice} LKR
                </label>
              </li>
            ))}
          </ul>
          <p style={{marginLeft: "32px", marginTop: "25px"}}>Total Price: LKR {totalPrice.toFixed(2)}</p>
          <div style={{marginTop: "20px"}} className="submitbtndiv">
            <button type="submit" className="btn btn-primary submitbtn" disabled={isCreatingOrder}>
              {isCreatingOrder ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCreate;
