import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//importing CSS files
import './DataTable.css'

const MenuAllItems2 = () => {

    const [ MenuAllItems, setMenuAllItems ] = useState([]);
    const [ MenuItemName , setMenuItemName ] = useState('');
    const [ AllOriginalMenuItems , setAllOriginalMenuItems ] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

        const getMenuAllItems = async () => {

            try{

                await axios.get('http://localhost:8000/menu/menuItems')
                .then((res) => {
                    setMenuAllItems(res.data.AllmenuItems);
                    setAllOriginalMenuItems(res.data.AllmenuItems);
                    console.log(res.data.message);
                })
                .catch((err) => {
                    console.log("☠️ :: Error on API URL! ERROR : ", err.message);
                })

            }catch(err){
                console.log("☠️ :: getMenuAllItems Function failed! ERROR : " + err.message);
            }

            
        }

        getMenuAllItems();

    }, [navigate])

    //search function

    const SearchFunction = async (searchTerm) => {

        try{
            await axios.get('http://localhost:8000/menu/searchmenuItem', {
            params: {
                menuItemName: searchTerm
            }})
            .then((res) => {
                if(res.data.searchedmenuItem.length === 0){
                    setMenuAllItems(res.data.searchedmenuItem);
                }
                else{
                    setMenuAllItems(res.data.searchedmenuItem);
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
        setMenuItemName(searchTerm);

        if (searchTerm === '') { // when placeholder empty fetch all data
            setMenuAllItems(AllOriginalMenuItems); // Fetch all data when search term is empty
        } else {
            await SearchFunction(searchTerm);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(MenuItemName);
    };

    const logout = (e) => {
        localStorage.clear()
        navigate('/')
    }

    return(
        <div className="menualldiv" >
            <div className="maintablecontainer" style={{marginBottom: "70px"}}>
                <div className="tableHead">
                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={MenuItemName} onChange={handleSearchChange} placeholder="Search..." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                        </form>
                    </div>
                </div>
            
                <div className = "tablecontainer">
                    <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>

                    <div className="tablediv">

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
                                </tr>
                            </thead>
                            <tbody>
                                {MenuAllItems.map((menuitems, index) => (
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

export default MenuAllItems2;