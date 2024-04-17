import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './DataTable.css';

const OrdersAll = () => {
  const [OrdersAll, setOrdersAll] = useState([]);
  const [allOriginalOrders,setAllOriginalOrders] = useState([]);
  const [OrderId, setOrderId] = useState('');

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
            res.data.AllOrders.forEach(order => {
              order.menuItems.forEach(item => {
                console.log(item.menuItemName);
              });
            });
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
            setOrdersAll(OrdersAll.filter(order => order._id !== id))
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
          OrderId: searchTerm
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
    setOrderId(searchTerm);

    if (searchTerm === '') { // when placeholder empty fetch all data
      setOrdersAll(allOriginalOrders); // Fetch all data when search term is empty
        
    } else {
        await SearchFunction(searchTerm);
    }
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    SearchFunction(OrderId);
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
                            <input id="searchBar" type="text" value={OrderId} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                        </form>
                    </div>
                </div>

                <div className="tablecontainer">
                <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
                <div className="addbtndiv"><Link to='/ordercreate'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Order</button></Link></div>
      
      <div className="tablediv">
               
        <ToastContainer />
        <table className="table table-striped tbl1">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Order-ID</th>
              {/* <th scope="col">Quantity</th> */}
              <th scope="col">Order-Items</th>
              <th scope="col">Full-Amount (LKR)</th>
              <th className="op" scope="col">Operations</th>
            </tr>
          </thead>
          <tbody>
            {OrdersAll.map((orders, index) => (
              <tr key={orders._id}>
                <th scope="row">{index + 1}</th>
                <td>{orders._id}</td>
                {/* <td>{orders.OrderQuantity}</td> */}
                <td>
                  <ul>
                    {orders.menuItems && orders.menuItems.length > 0 ? (
                        orders.menuItems.map(menuitem => (
                          <li key={menuitem._id}>
                           {menuitem.menuItemName} - {menuitem.menuItemPrice ? menuitem.menuItemPrice.toFixed(2) : 'N/A'} LKR
                          </li>
                        ))
                      ) : (
                        <li>No items</li>
                      )}
                  </ul>
                </td>
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
