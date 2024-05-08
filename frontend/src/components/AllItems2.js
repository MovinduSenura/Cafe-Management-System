import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
//import './AllItems.css'
import './AllItems2.css'



export const AllItems2 = () => {

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

    // const handleDelete = async (id) => {

    //     try{

    //         const confirmed = window.confirm('Are you sure you want to delete this item?');

    //         if(confirmed){

    //            await axios.delete(`http://localhost:8000/stock/itemDelete/${id}`)
    //            .then((res) => {
    //             alert(res.data.message);
    //             console.log(res.data.message);
    //             window.location.href='/items'
    //         })
    //         .catch((err) => {
    //             console.log('☠ :: Error on API URL : ' + err.message);
    //         })

    //     } else {
    //         toast.warning('Deletion cancelled!')
    //         console.log('Deletion cancelled!')
    //     }

    //     }catch(err) {
    //         console.log('☠ :: handleDelete function failed! ERROR: ' + err.message);
    //     }
      
    // }

    
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

    return (
        <div className="alldivIII">

        <div className = "maintablecontainerIII">
          {/* <h1>Stocks</h1> */}

          <div className="tableHead">

                    <div className="search-containerIII">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={itemName} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                        </form>
                    </div>
                </div>

                <div className="tablecontainerIII">
                    <div className="logoutdivIII"><button type="button" class="btn btn-secondary btn-lg LogoutBtnIII" onClick={logout}>Logout</button></div>

                    <div className="tabledivIII">

          {/* <ToastContainer/> */}

            <table className = "table table-striped tblIII">
                <thead>
                    <tr>
                        <th scope = "col">ID</th>
                        <th scope = "col">Ingredient Name</th>
                        <th scope = "col" >Quantity</th>
                        <th scope = "col">Minimum Stock Level</th>
                        <th scope = "col">Current Stock Level</th>
                        { <th scope = "col" className='opIII'>Operation</th> }
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
                                <table className='EditDeleteBTNsIII'>
                                <tbody>
                                <tr>
                                <td><Link to={`/stockupdateform2/${items._id}`}><button type="button" className="btn btn-success">Edit</button></Link>&nbsp;
                                </td>
                                <td>
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

export default AllItems2;