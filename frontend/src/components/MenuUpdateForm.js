import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

//importing CSS files
import './MenuCreateForm.css'

const MenuUpdateForm = () => {

    // const [menuItemImage, setmenuItemImage] = useState('');
    const fileInputRef = useRef(null); // Create a ref for file input
    const [uploadedFileName, setUploadedFileName] = useState(''); // State to store uploaded file name
    const [menuItemName, setmenuItemName] = useState('');
    const [menuItemDescription, setmenuItemDescription] = useState('');
    const [menuItemCategory, setmenuItemCategory] = useState('');
    const [menuItemPrice, setmenuItemPrice] = useState('');
    const [menuItemAvailability, setmenuItemAvailability] = useState('');

    //using useParams we catching id from URL and assign it to id const
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        const getOneData = async () => {
            try{

                await axios.get(`http://localhost:8000/menu/menuItem/${id}`)
                .then((res) => {
                    setUploadedFileName(res.data.MenuItem.menuItemImage);
                    setmenuItemName(res.data.MenuItem.menuItemName);
                    setmenuItemDescription(res.data.MenuItem.menuItemDescription);
                    setmenuItemCategory(res.data.MenuItem.menuItemCategory);
                    setmenuItemPrice(res.data.MenuItem.menuItemPrice);
                    setmenuItemAvailability(res.data.MenuItem.menuItemAvailability);
                    console.log("✨ :: Item fetched successfully!");
                })
                .catch((err) => {
                    console.log("☠️ :: Error on API URL : " + err.message);
                })

            }catch (err){
                console.log("☠️ :: getOneData function failed! ERROR : " + err.message);
            }
        }

        getOneData();

    }, [id])

    const updateData = (e) => {
        e.preventDefault();

        try{

            const updateformdata = new FormData(); // Create updateformdata object to append data
            // menuformdata.append('menuItemImage', menuItemImage);
            updateformdata.append('menuItemImage', fileInputRef.current.files[0]); // Retrieve file from file input ref
            updateformdata.append('menuItemName', menuItemName);
            updateformdata.append('menuItemDescription', menuItemDescription);
            updateformdata.append('menuItemCategory', menuItemCategory);
            updateformdata.append('menuItemPrice', menuItemPrice);
            updateformdata.append('menuItemAvailability', menuItemAvailability);

            // let updatemenuItem = {
            //     menuItemImage: menuItemImage,
            //     menuItemName: menuItemName,
            //     menuItemDescription: menuItemDescription,
            //     menuItemCategory: menuItemCategory,
            //     menuItemPrice: menuItemPrice,
            //     menuItemAvailability: menuItemAvailability,
            // }

            axios.patch(`http://localhost:8000/menu/menuItemUpdate/${id}`, updateformdata)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
                navigate('/')
            })
            .catch((err) => {
                console.log("☠️ :: Error on API URL or updatemenuItem object : " + err.message)
            })

        }catch(err){
            console.log("☠️ :: updateData Function failed ERROR : " + err.message);
        }
    }

    return (

        <div className="menucreateFormContainer">

            <div className="menuformBootstrap">
                <h2>Update Form</h2>
                <form onSubmit={updateData}>
                    <div className="form-group mb-3">
                        <label for="menuItemImage">Image:</label>
                        <input type="file" accept="image/*" className="form-control" id="menuItemImage" placeholder="Enter menuItemImage" autoComplete="off" ref={fileInputRef}/>
                        {/* Display uploaded file name  */}
                        {uploadedFileName && <p>Uploaded File: {uploadedFileName}</p>} 
                    </div>
                    <div className="form-group mb-3">
                        <label for="menuItemName">Item Name:</label>
                        <input type="text" className="form-control" id="menuItemName" placeholder="Enter Item Name" autoComplete="off" onChange={(e) => setmenuItemName(e.target.value)} value={menuItemName}/>
                    </div>
                    <div className="form-group mb-3">
                        <label for="menuItemDescription">Description</label>
                        <textarea class="form-control" id="menuItemDescription" rows="3" autoComplete="off" onChange={(e) => setmenuItemDescription(e.target.value)} value={menuItemDescription}></textarea>
                    </div>
                    <div className="mb-3">
                        <label for="menuItemCategory">Category</label>
                        <select className="form-select" id="menuItemCategory" onChange={(e) => setmenuItemCategory(e.target.value)} value={menuItemCategory}>
                            <option selected>-Select-</option>
                            <option value="Beverage">Beverage</option>
                            <option value="Food">Food</option>
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label for="menuItemPrice">Price(Rs):</label>
                        <input type="number" className="form-control" id="menuItemPrice" placeholder="Enter Price" autoComplete="off" min={0} onChange={(e) => setmenuItemPrice(e.target.value)} value={menuItemPrice}/>
                    </div>
                    <div className="form-group mb-3">
                        <label for="menuItemAvailability">Availability:</label>
                        <input type="text" className="form-control" id="menuItemAvailability" placeholder="Mention Availability (Yes/No)" autoComplete="off" onChange={(e) => setmenuItemAvailability(e.target.value)} value={menuItemAvailability}/>
                    </div>
                    <div className="submitbtndiv">
                    <button type="submit" className="btn btn-primary submitbtn">Update</button>
                    </div>
                </form>
            </div>

        </div>

    )

};

export default MenuUpdateForm;
