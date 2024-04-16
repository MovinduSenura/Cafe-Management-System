import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import './AllItems.css'
import './DataTable.css'



export const AllItems = () => {

    //const navigate = useNavigate();
    
    const[ AllItems, setAllItems ] = useState([]);
    const [ allOriginalItems, setAllOriginalItems ] = useState([]);
    const[ itemName, setitemName ] = useState("");

    useEffect(() => {

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

    }, [])

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

            <div className="logoutdiv"><Link to='/'><button type="button" class="btn btn-secondary btn-lg LogoutBtn">Logout</button></Link></div>
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