// OrderForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderCreate = () => {

  const [MenuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch items from backend when the component mounts
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/menu/menuItems'); // Adjust the API endpoint as needed
      setMenuItems(response.data.AllmenuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleItemChange = (itemId, isChecked) => {
    if (isChecked) {
      // Add the item to selectedItems
      const selectedItem = MenuItems.find(item => item._id === itemId);
      setSelectedItems([...selectedItems, selectedItem]);
      setTotalPrice(totalPrice + selectedItem.menuItemPrice);
    } else {
      // Remove the item from selectedItems
      const updatedItems = selectedItems.filter(item => item._id !== itemId);
      setSelectedItems(updatedItems);
      const removedItem = MenuItems.find(item => item._id === itemId);
      setTotalPrice(totalPrice - removedItem.menuItemPrice);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create order request
      const response = await axios.post('http://localhost:8000/order/create', {
        MenuitemIds: selectedItems.map(item => item._id),
      });
      console.log('Order created:', response.data.Order);
      console.log(response.data.Order._id);
      
      alert("🍟 Order Created!");
      
      navigate(`/payment/${response.data.Order._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <h2>Add Menu items to Order</h2>
      <form onSubmit={handleSubmit}>
        <ul>
          {MenuItems.map(item => (
            <li key={item._id}>
              <label>
                <input
                  type="checkbox"
                  onChange={e => handleItemChange(item._id, e.target.checked)}
                />
                {item.menuItemName} - {item.menuItemPrice}LKR
              </label>
            </li>
          ))}
        </ul>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default OrderCreate;
