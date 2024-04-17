import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './DataTable.css';

const OrdersAll = () => {
  const [OrdersAll, setOrdersAll] = useState([]);
  const [allOriginalOrders,setAllOriginalOrders] = useState([]);
  const [OrderName, setOrderName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

    const getAllOrders = async () => {
      try {
        await axios
          .get("http://localhost:8000/order/allOrders")
          .then((res) => {
            setOrdersAll(res.data.AllOrders);
            setAllOriginalOrders(res.data.AllOrders);
          })

          .catch((err) => {
            console.log("💀 :: Error on API URL! Error : " + err.message);
          });
      } catch (err) {
        console.log(
          "💀 :: getAllOrders function failed! ERROR : " + err.message
        );
      }
    };

    getAllOrders();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this order?"
      );

      if (confirmed) {
        await axios
          .delete(`http://localhost:8000/order/delete/${id}`)
          .then((res) => {
            alert(res.data.message);
            console.log(res.data.message);
          });
      } else {
        toast.warning("Deletion Cancelled!");
        console.log("Deletion Cancelled!");
      }
    } catch (err) {
      console.log("💀 :: handleDelete function failed! ERROR : " + err.message);
    }
  };


  //Search Function
  const SearchFunction = async (searchTerm) => {
    // e.preventDefault();

    try{
        await axios.get('http://localhost:8000/order/searchOrder', {
        params: {
          OrderName: searchTerm
        }})
        .then((res) => {
            if(res.data.searchedOrder.length === 0){
              setOrdersAll(res.data.searchedOrder);
            }
            else{
              setOrdersAll(res.data.searchedOrder);
                console.log(res.data.message);
            }
        })
        .catch((error) => {
            console.log("💀 :: Error on response from server! ERROR : ", error.message);
        })

    }catch(err){
        console.log("💀 :: Error on axios API Request! ERROR : ", err.message);
    }
}


const handleSearchChange = async (e) => {
    const searchTerm = e.target.value;
    setOrderName(searchTerm);

    if (searchTerm === '') { // when placeholder empty fetch all data
      setOrdersAll(allOriginalOrders); // Fetch all data when search term is empty
        
    } else {
        await SearchFunction(searchTerm);
    }
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    SearchFunction(OrderName);
};

const logout = (e) => {
  localStorage.clear()
  navigate('/')
}

  return (
    <div className="alldiv">
      <div className="maintablecontainer">
      <div className="tableHead">
                    {/* <h2>Search Order</h2> */}

                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={OrderName} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                        </form>
                    </div>
                </div>

                <div className="tablecontainer">
                <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
                <div className="addbtndiv"><Link to='/CreateOrder'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Order</button></Link></div>
      
      <div className="tablediv">
               
        <ToastContainer />
        <table className="table table-striped tbl1">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Order-Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Full-Amount</th>
              <th className="op" scope="col">Operations</th>
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
                  <table className="EditDeleteBTNs">
                    <tbody>
                      <tr>
                        <td>
                          <Link to={`/OrderUpdate/${orders._id}`}>
                            <button className="btn btn-success">Edit</button>
                          </Link></td>
                          &nbsp;&nbsp;
                          <td><button
                            className="btn btn-danger"
                            onClick={() => handleDelete(orders._id)}
                          >Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
);
};

export default OrdersAll;
