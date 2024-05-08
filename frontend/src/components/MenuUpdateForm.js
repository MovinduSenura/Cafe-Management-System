import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

//importing CSS files
import './UpdateForm.css'

const MenuUpdateForm = () => {

    const fileInputRef = useRef(null); // Create a ref for file input
    const [uploadedFileName, setUploadedFileName] = useState(''); // State to store uploaded file name
    const [menuItemName, setmenuItemName] = useState('');
    const [menuItemDescription, setmenuItemDescription] = useState('');
    const [menuItemCategory, setmenuItemCategory] = useState('');
    const [menuItemPrice, setmenuItemPrice] = useState('');
    const [menuItemAvailability, setmenuItemAvailability] = useState(false); // Initialize as false

    const [formErrors, setFormErrors] = useState({}); // State for form errors

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

        // Perform form validation
        if (!menuItemName || !menuItemDescription || !menuItemCategory || !menuItemPrice) {
            setFormErrors({ message: "All fields are required." });
            return;
        }

        try {

            const updateformdata = new FormData(); // Create updateformdata object to append data
            updateformdata.append('menuItemImage', fileInputRef.current.files[0]); // Retrieve file from file input ref
            updateformdata.append('menuItemName', menuItemName);
            updateformdata.append('menuItemDescription', menuItemDescription);
            updateformdata.append('menuItemCategory', menuItemCategory);
            updateformdata.append('menuItemPrice', menuItemPrice);
            updateformdata.append('menuItemAvailability', menuItemAvailability);

            axios.patch(`http://localhost:8000/menu/menuItemUpdate/${id}`, updateformdata)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
                navigate('/allmenuitems')
            })
            .catch((err) => {
                console.log("☠️ :: Error on API URL or updatemenuItem object : " + err.message)
            })

        } catch (err) {
            console.log("☠️ :: updateData Function failed ERROR : " + err.message);
        }
    }

    return (

        <div className="updateFormContainer">

            <div className="updateformBootstrap">
                <h2>Update Form</h2>
                <form onSubmit={updateData}>
                    <div className="form-group mb-3">
                        <label htmlFor="menuItemImage">Image:</label>
                        <input type="file" accept="image/*" className="form-control" id="menuItemImage" placeholder="Enter menuItemImage" autoComplete="off" ref={fileInputRef}/>
                        {/* Display uploaded file name  */}
                        {uploadedFileName && <p>Uploaded File: {uploadedFileName}</p>} 
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="menuItemName">Item Name:</label>
                        <input type="text" className="form-control" id="menuItemName" placeholder="Enter Item Name" autoComplete="off" onChange={(e) => setmenuItemName(e.target.value)} value={menuItemName}/>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="menuItemDescription">Description:</label>
                        <textarea className="form-control" id="menuItemDescription" rows="3" autoComplete="off" onChange={(e) => setmenuItemDescription(e.target.value)} value={menuItemDescription}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="menuItemCategory">Category:</label>
                        <select className="form-select" id="menuItemCategory" onChange={(e) => setmenuItemCategory(e.target.value)} value={menuItemCategory}>
                            <option value="">-Select-</option>
                            <option value="Beverage">Beverage</option>
                            <option value="Food">Food</option>
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="menuItemPrice">Price (LKR):</label>
                        <input type="number" className="form-control" id="menuItemPrice" placeholder="Enter Price" autoComplete="off" min={0} onChange={(e) => setmenuItemPrice(e.target.value)} value={menuItemPrice}/>
                    </div>
                    <div className="form-check mb-3">
                        <input type="checkbox" className="form-check-input" id="menuItemAvailability" checked={menuItemAvailability} onChange={(e) => setmenuItemAvailability(e.target.checked)}/>
                        <label className="form-check-label" htmlFor="menuItemAvailability">Available</label>
                    </div>
                    {formErrors.message && <div className="text-danger">{formErrors.message}</div>} {/* Display form error message */}
                    <div className="updatebtndiv">
                    <button type="submit" className="btn btn-primary submitbtn">Update</button>
                    </div>
                </form>
            </div>

        </div>

    )

};

export default MenuUpdateForm;
