import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTable.css'

const MenuAllItems = () => {
    const [menuAllItems, setMenuAllItems] = useState([]);
    const [menuItemName, setMenuItemName] = useState('');
    const [allOriginalMenuItems, setAllOriginalMenuItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

        const getMenuAllItems = async () => {
            try {
                const res = await axios.get('http://localhost:8000/menu/menuItems');
                setMenuAllItems(res.data.AllmenuItems);
                setAllOriginalMenuItems(res.data.AllmenuItems);
                console.log(res.data.message);
            } catch (err) {
                console.log("☠️ :: Error on API URL! ERROR : ", err.message);
            }
        };

        getMenuAllItems();
    }, [navigate]);

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('Are you sure want to delete this item?');
            if (confirmed) {
                await axios.delete(`http://localhost:8000/menu/deletemenuItem/${id}`)
                    .then((res) => {
                        setMenuAllItems(menuAllItems.filter(menuitems => menuitems._id !== id));
                        alert(res.data.message);
                        console.log(res.data.message);
                    })
                    .catch((err) => {
                        console.log('☠️ :: Error on API URL : ' + err.message);
                    })
            } else {
                toast.warning('Deletion Cancelled!');
                console.log('Deletion Cancelled!');
            }
        } catch (err) {
            console.log('☠️ :: handleDelete function failed! ERROR : ' + err.message);
        }
    }

    //search function

    const SearchFunction = async (searchTerm) => {

        try {
            await axios.get('http://localhost:8000/menu/searchmenuItem', {
                params: {
                    menuItemName: searchTerm
                }
            })
                .then((res) => {
                    if (res.data.searchedmenuItem.length === 0) {
                        setMenuAllItems(res.data.searchedmenuItem);
                    }
                    else {
                        setMenuAllItems(res.data.searchedmenuItem);
                        console.log(res.data.message);
                    }
                })
                .catch((error) => {
                    console.log("☠️ :: Error on response from server! ERROR : ", error.message);
                })

        } catch (err) {
            console.log("☠️ :: Error on axios API Request! ERROR : ", err.message);
        }
    }


    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;
        setMenuItemName(searchTerm);

        if (searchTerm === '') { // when placeholder empty fetch all data
            setMenuAllItems(allOriginalMenuItems); // Fetch all data when search term is empty
        } else {
            await SearchFunction(searchTerm);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(menuItemName);
    };

    const logout = (e) => {
        localStorage.clear()
        navigate('/')
    }

    //generate Invoice
  const downloadInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:8000/menu/generate-menu-invoice",
        
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

    return (
        <div className="alldiv">
            <div className="maintablecontainer">
                <div className="tableHead">
                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={menuItemName} onChange={handleSearchChange} placeholder="Search..." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button>
                        </form>
                    </div>
                </div>

                <div className = "tablecontainer">
                    <div className="logoutdiv">
                        <button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button>
                    </div>
                    <div className="addbtndiv"><Link to='/menucreateform'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Item</button></Link></div>
                    <div className="reportbtndiv">
                        <button type="button" className="btn btn-secondary btn-lg ReportBtn" onClick={downloadInvoice}>Download Menu Leaflet</button>        
                    </div>

                    <div className="tablediv">

                        <ToastContainer/>

                        <table className="table table-striped tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Item No.</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Price (LKR)</th>
                                    <th scope="col">Availability</th>
                                    <th className="op" scope="col">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuAllItems.map((menuitems, index) => (
                                    <tr key={menuitems._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            <img
                                                src={require(`../uploads/${menuitems.menuItemImage}`)}
                                                width={30}
                                                height={40}
                                                alt="menuItemImage"
                                            />
                                        </td>
                                        <td>{menuitems.menuItemName}</td>
                                        <td>{menuitems.menuItemDescription}</td>
                                        <td>{menuitems.menuItemCategory}</td>
                                        <td>{menuitems.menuItemPrice}</td>
                                        <td>{menuitems.menuItemAvailability ? "Yes" : "No"}</td>
                                        <td>
                                            <table className="EditDeleteBTNs">
                                                <tbody>
                                                    <tr>
                                                        <td><Link to={`/menuupdateform/${menuitems._id}`}><button type="button" className="btn btn-success">Edit</button></Link></td>&nbsp;&nbsp;
                                                        <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(menuitems._id)}>Delete</button></td>
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
    )
};

export default MenuAllItems;
