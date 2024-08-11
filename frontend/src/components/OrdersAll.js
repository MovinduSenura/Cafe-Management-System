import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; //useNavigate is used to help trigger a navigation event within a component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './DataTable.css';

const OrdersAll = () => {
  const [OrdersAll, setOrdersAll] = useState([]);
  const [allOriginalOrders, setAllOriginalOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/404'); // Redirect to 404 page if token is not present
      return;
    }

    const getAllOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/order/allOrders");
        setOrdersAll(res.data.AllOrders);
        setAllOriginalOrders(res.data.AllOrders);
      } catch (err) {
        console.log("💀 :: Error on API URL! Error : " + err.message);
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
        await axios.delete(`http://localhost:8000/order/delete/${id}`);
        setOrdersAll(OrdersAll.filter(order => order._id !== id));
        alert("Order deleted successfully!");
      } else {
        toast.warning("Deletion Cancelled!");
      }
    } catch (err) {
      console.log("💀 :: handleDelete function failed! ERROR : " + err.message);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
    if (!term) {
      setOrdersAll(allOriginalOrders);
    } else {
      const filteredOrders = allOriginalOrders.filter(order => {
        return order._id.toLowerCase().includes(term) ||
          order.menuItems.some(item => item.menuItemName.toLowerCase().includes(term));
      });
      setOrdersAll(filteredOrders);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const logout = (e) => {
    localStorage.clear();
    navigate('/');
  }

    //generate Invoice
    const downloadInvoice = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.get(
          "http://localhost:8000/order/generate-Order-invoice"
        );
  
        const { filepath } = response.data;
  
        // Create a new <a> element to simulate a download link
        const link = document.createElement("a");
        // Set the href attribute of the link to the filepath of the generated invoice
        link.href = filepath;
        // Set the "download" attribute to specify the default file name for the downloaded file
        link.setAttribute("download", "invoice.pdf");
        // Append the link to the document body
        document.body.appendChild(link);
  
        // Simulate a click on the link to trigger the download
        link.click();
  
         // Remove the link from the document body after the download is complete
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading invoice:", error.message);
      }
    };

    // const goToReserver = () => {
    //   navigate('/reservation')
    // }

  return (
    <div className="alldiv">
      <div className="maintablecontainer">
        <div className="tableHead">
          <div className="search-container">
            <form className="searchTable" onSubmit={handleFormSubmit}>
              <input id="searchBar" type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search by Order" name="search" />
              <button type="submit"><i className="fa fa-search" style={{ color: "#ffffff", }}></i></button>
            </form>
          </div>
          {/* <button className="btn btn-primary" onClick={generatePDFReport}>Generate PDF Report</button> */}
        </div>

        <div className="tablecontainer">
          <div className="reportbtndiv"><button type="button" style={{marginRight: '10px'}} className="btn btn-secondary btn-lg ReportBtn" 
onClick={downloadInvoice}> Download Invoice </button> 
<div className="reportbtndiv">
  <Link to="/reservation">
    <button type="button" className="btn btn-secondary btn-lg ReportBtn">Make a Reservation</button>
  </Link>
</div>


</div>
          <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
          <div className="addbtndiv"><Link to='/ordercreate'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Order</button></Link></div>

          <div className="tablediv">
            <ToastContainer />
            <table className="table table-striped tbl1">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Order-ID</th>
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
                            <td>
                              <button
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
