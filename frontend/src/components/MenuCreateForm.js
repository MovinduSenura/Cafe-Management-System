import React, { useState, useRef } from "react";
import axios from 'axios';

//importing CSS files
import './CreateForm.css'

const MenuCreateForm = () => {
    const fileInputRef = useRef(null); // Create a ref for file input
    const [menuItemName, setmenuItemName] = useState('');
    const [menuItemDescription, setmenuItemDescription] = useState('');
    const [menuItemCategory, setmenuItemCategory] = useState('');
    const [menuItemPrice, setmenuItemPrice] = useState('');
    const [menuItemAvailability, setmenuItemAvailability] = useState(false); // Initialize as false
    const [formErrors, setFormErrors] = useState({}); // State for form errors

    const sendData = (e) => {
        e.preventDefault();

        // Perform form validation
        if (!menuItemName || !menuItemDescription || !menuItemCategory || !menuItemPrice) {
            setFormErrors({ message: "All fields are required." });
            return;
        }

        const menuformdata = new FormData(); // Create menuformdata object to append data
        menuformdata.append('menuItemImage', fileInputRef.current.files[0]); // Retrieve file from file input ref
        menuformdata.append('menuItemName', menuItemName);
        menuformdata.append('menuItemDescription', menuItemDescription);
        menuformdata.append('menuItemCategory', menuItemCategory);
        menuformdata.append('menuItemPrice', menuItemPrice);
        menuformdata.append('menuItemAvailability', menuItemAvailability);

        try {
            axios.post('http://localhost:8000/menu/create', menuformdata, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((res) => {
                    alert(res.data.message);
                    console.log(res.data.status);
                    console.log(res.data.message);
                })
                .catch((err) => {
                    console.log("☠️ :: Error on API URL or newmenuItem object : " + err.message)
                })

            // Clear file input by replacing it with a new one
            fileInputRef.current.value = '';
            setmenuItemName('');
            setmenuItemDescription('');
            setmenuItemCategory('');
            setmenuItemPrice('');
            setmenuItemAvailability(false); // Set back to false after form submission
            setFormErrors({}); // Clear any previous form errors

        } catch (err) {
            console.log("☠️ :: sendData Function failed ERROR : " + err.message);
        }
    }

    return (
        <div className="createFormContainer">
            <div className="formBootstrap">
                <h2>New Item Form</h2>
                <form onSubmit={sendData}>
                    <div className="form-group mb-3">
                        <label htmlFor="menuItemImage">Image:</label>
                        <input type="file" accept="image/*" className="form-control" id="menuItemImage" placeholder="Enter menuItemImage" autoComplete="off" ref={fileInputRef} required />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="menuItemName">Item Name:</label>
                        <input type="text" className="form-control" id="menuItemName" placeholder="Enter Item Name" autoComplete="off" onChange={(e) => setmenuItemName(e.target.value)} value={menuItemName} />
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
                        <input type="number" className="form-control" id="menuItemPrice" placeholder="Enter Price" autoComplete="off" min={0} onChange={(e) => setmenuItemPrice(e.target.value)} value={menuItemPrice} />
                    </div>
                    <div className="form-check mb-3">
                        <input type="checkbox" className="form-check-input" id="menuItemAvailability" checked={menuItemAvailability} onChange={(e) => setmenuItemAvailability(e.target.checked)} />
                        <label className="form-check-label" htmlFor="menuItemAvailability">Available</label>
                    </div>
                    {formErrors.message && <div className="text-danger">{formErrors.message}</div>} {/* Display form error message */}
                    <div className="submitbtndiv">
                        <button type="submit" className="btn btn-primary submitbtn">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default MenuCreateForm;
