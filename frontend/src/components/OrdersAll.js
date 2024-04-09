import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './OrderAll.css';

const OrdersAll = () => {
  const [OrdersAll, setOrdersAll] = useState([]);

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        await axios
          .get("http://localhost:8000/order/allOrders")
          .then((res) => {
            setOrdersAll(res.data.AllOrders);
          })

          .catch((err) => {
            console.log("💀 :: Error on API URL! Error : " + err.message);
          });
      } catch (err) {
        console.log("💀 :: getAllOrders function failed! ERROR : " + err.message);
      }
    };

    getAllOrders();
  }, []);

  const handleDelete = async (id) => {

    try {
      const confirmed = window.confirm('Are you sure you want to delete this order?');

      if(confirmed){
        await axios.delete(`http://localhost:8000/order/delete/${id}`)
        .then((res) => {
          alert(res.data.message);
          console.log(res.data.message);
        });
      }else {
        toast.warning('Deletion Cancelled!');
        console.log('Deletion Cancelled!');
      }
    }catch(err){
      console.log("💀 :: handleDelete function failed! ERROR : " + err.message)
    }

  }

  return (
    <div className="OrdersAllContainer">

      <ToastContainer/>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Order-Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Full-Amount</th>
            <th scope="col">Operations</th>
          </tr>
        </thead>
        <tbody>
          {OrdersAll.map((orders, index) => (
            <tr key={orders._id}>
              <td>{index + 1}</td>
              <td>{orders.OrderName}</td>
              <td>{orders.OrderQuantity}</td>
              <td>{orders.OrderPrice}</td>
              <td>
                <Link to = {`/OrderUpdate/${orders._id}`}><button className="btn btn-success mr-1">Edit</button></Link>
                &nbsp;
                <button className="btn btn-danger mr-1" onClick={() => handleDelete(orders._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersAll;
