import React, { useState } from "react";
import axios from 'axios';

//importing CSS files
import './MenuCreateForm.css'

const MenuCreateForm = () => {

    const [menuItemImage, setmenuItemImage] = useState('');
    const [menuItemName, setmenuItemName] = useState('');
    const [menuItemDescription, setmenuItemDescription] = useState('');
    const [menuItemCategory, setmenuItemCategory] = useState('');
    const [menuItemPrice, setmenuItemPrice] = useState('');
    const [menuItemAvailability, setmenuItemAvailability] = useState('');

    const sendData = (e) => {
        e.preventDefault();

        try{

            let newmenuItem = {
                menuItemImage: menuItemImage,
                menuItemName: menuItemName,
                menuItemDescription: menuItemDescription,
                menuItemCategory: menuItemCategory,
                menuItemPrice: menuItemPrice,
                menuItemAvailability: menuItemAvailability,
            }

            axios.post('http://localhost:8000/menu/create', newmenuItem)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
            })
            .catch((err) => {
                console.log("☠️ :: Error on API URL or newmenuItem object : " + err.message)
            })

            //set State back to first state
            setmenuItemImage('');
            setmenuItemName('');
            setmenuItemDescription('');
            setmenuItemCategory('');
            setmenuItemPrice('');
            setmenuItemAvailability('');

        }catch(err){
            console.log("☠️ :: sendData Function failed ERROR : " + err.message);
        }
    }

    return (

        <div className="menucreateFormContainer">

            <div className="menuformBootstrap">
                <h2>New Item Form</h2>
                <form onSubmit={sendData}>
                    <div className="form-group mb-3">
                        <label for="menuItemImage">Image:</label>
                        <input type="text" className="form-control" id="menuItemImage" placeholder="Enter menuItemImage" onChange={(e) => setmenuItemImage(e.target.value)} value={menuItemImage}/>
                    </div>
                    <div className="form-group mb-3">
                        <label for="menuItemName">Item Name:</label>
                        <input type="text" className="form-control" id="menuItemName" placeholder="Enter Item Name" onChange={(e) => setmenuItemName(e.target.value)} value={menuItemName}/>
                    </div>
                    <div className="form-group mb-3">
                        <label for="menuItemDescription">Description</label>
                        <textarea class="form-control" id="menuItemDescription" rows="3" onChange={(e) => setmenuItemDescription(e.target.value)} value={menuItemDescription}></textarea>
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
                        <label for="menuItemPrice">Price:</label>
                        <input type="text" className="form-control" id="menuItemPrice" placeholder="Enter Price" onChange={(e) => setmenuItemPrice(e.target.value)} value={menuItemPrice}/>
                    </div>
                    <div className="form-group mb-3">
                        <label for="menuItemAvailability">Availability:</label>
                        <input type="text" className="form-control" id="menuItemAvailability" placeholder="Mention Availability (Yes/No)" onChange={(e) => setmenuItemAvailability(e.target.value)} value={menuItemAvailability}/>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
    

        </div>

    )

};

export default MenuCreateForm;
