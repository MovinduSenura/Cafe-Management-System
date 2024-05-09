import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import './AllItems.css'
import './DataTable.css'



export const AllItems = () => {

    //const navigate = useNavigate();
    
    const[ AllItems, setAllItems ] = useState([]);
    const [ allOriginalItems, setAllOriginalItems ] = useState([]);
    const[ itemName, setitemName ] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

        const getAllItems = async () => {

            try{

                await axios.get('http://localhost:8000/stock/items')
                .then((res) => {
                    setAllItems(res.data.AllItems);
                    setAllOriginalItems(res.data.AllItems);
                    console.log(res.data.mesage);
                    console.log('status :' + res.data.status)

            })
            .catch((err) => {
                console.log("💀 :: Error on API URL! ERROR :", err.message);
            })

            
        }catch(err) {
                console.log("💀 :: Error on API URL! ERROR :", err.message);
            }
        }

        getAllItems();

    }, [navigate])

    const handleDelete = async (id) => {

        try{

            const confirmed = window.confirm('Are you sure you want to delete this item?');

            if(confirmed){

               await axios.delete(`http://localhost:8000/stock/itemDelete/${id}`)
               .then((res) => {
                alert(res.data.message);
                console.log(res.data.message);
                window.location.href='/items'
            })
            .catch((err) => {
                console.log('☠ :: Error on API URL : ' + err.message);
            })

        } else {
            toast.warning('Deletion cancelled!')
            console.log('Deletion cancelled!')
        }

        }catch(err) {
            console.log('☠ :: handleDelete function failed! ERROR: ' + err.message);
        }
      
    }

    
    //search functions

    const SearchFunction = async (searchTerm) => {
        // e.preventDefault();

        try{
            await axios.get('http://localhost:8000/stock/searchItem', {
            params: {
                itemName: searchTerm
            }})
            .then((res) => {
                if(res.data.searchedItem.length === 0){
                    setAllItems(res.data.searchedItem);
                    // setSearchString("😵 '" + searchTerm + "' was not found in database!");
                    // setErrorString('');
                }
                else{
                    setAllItems(res.data.searchedItem);
                    console.log(res.data.message);
                }
            })
            .catch((error) => {
                console.log("☠️ :: Error on response from server! ERROR : ", error.message);
            })

        }catch(err){
            console.log("☠️ :: Error on axios API Request! ERROR : ", err.message);
        }
    }


    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;
        setitemName(searchTerm);

        if (searchTerm === '') { // when placeholder empty fetch all data
            setAllItems(allOriginalItems); // Fetch all data when search term is empty
            
        } else {
            await SearchFunction(searchTerm);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(itemName);
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
        "http://localhost:8000/stock/stock-generate-invoice"
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

        <div className = "maintablecontainer">
          {/* <h1>Stocks</h1> */}

          <div className="tableHead">

                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={itemName} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                        </form>
                    </div>
            </div>

         <div className="tablecontainer">


            <div className="logoutdiv"><button type="button" class="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
            
            <button
              type="button"
              className="btn btn-secondary btn-lg ReportBtn"
              onClick={downloadInvoice}
            >
              Download Invoice
            </button>

            <div className="addbtndiv"><Link to='/stockcreateform'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Item</button></Link></div>

            <div className="tablediv">

          <ToastContainer/>

            <table className = "table table-striped tbl">
                <thead>
                    <tr>
                        <th scope = "col">ID</th>
                        <th scope = "col">Ingredient Name</th>
                        <th scope = "col">Quantity</th>
                        <th scope = "col">Minimum Stock Level</th>
                        <th scope = "col">Current Stock Level</th>
                        <th scope = "col" className='op'>Operations</th>
                    </tr>
                    </thead>
                    <tbody>
                        {AllItems.map((items,index) => (
                        <tr key = {items._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{items.itemName}</td>
                            <td>{items.quantity}</td>
                            <td>{items.minstocklevel}</td>
                            <td>{items.currentstocklevel}</td>
                            

                            <td>
                                <table className='EditDeleteBTNs'>
                                <tbody>
                                <tr>
                                <td><Link to={`/stockupdateform/${items._id}`}><button type="button" className="btn btn-success">Edit</button></Link>&nbsp;&nbsp;
                                </td>
                                <td>
                                <button type="button" className="btn btn-danger" onClick={() => handleDelete(items._id)}>Delete</button>
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

    )
};

export default AllItems;