import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//importing CSS files
import './MenuAllItems.css'

const MenuAllItems = () => {

    const [ MenuAllItems, setMenuAllItems ] = useState([]);

    useEffect(() => {

        const getMenuAllItems = async () => {

            try{

                await axios.get('http://localhost:8000/menu/menuItems')
                .then((res) => {
                    setMenuAllItems(res.data.AllmenuItems);
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

    }, [])

    const handleDelete = async (id) => {

        try{

            const confirmed = window.confirm('Are you sure want to delete this item?');

            if(confirmed){
                await axios.delete(`http://localhost:8000/menu/deletemenuItem/${id}`)
                .then((res) => {
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
        }catch(err) {
            console.log('☠️ :: handleDelete function failed! ERROR : ' + err.message);
        }
    }

    return(
        <div className="menualldiv">
            
            <div className = "tablecontainer">
                <div className="addbtndiv"><Link to='/menucreateform'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add item</button></Link></div>
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
                        <th scope="col">Price</th>
                        <th scope="col">Availability</th>
                        <th className="op" scope="col">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {MenuAllItems.map((menuitems, index) => (
                        <tr key={menuitems._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{menuitems.menuItemImage}</td>
                            <td>{menuitems.menuItemName}</td>
                            <td>{menuitems.menuItemDescription}</td>
                            <td>{menuitems.menuItemCategory}</td>
                            <td>{menuitems.menuItemPrice}</td>
                            <td>{menuitems.menuItemAvailability}</td>
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
    )
};

export default MenuAllItems;