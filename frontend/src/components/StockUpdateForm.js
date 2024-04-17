import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

// Import CSS file
//import './StockCreateForm.css';
import './UpdateForm.css'

const StockUpdateForm = () => {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [currentstocklevel, setCurrentStockLevel] = useState('');
    const [minstocklevel, setMinStockLevel] = useState('');

    //using useParams we catch id from URL and assign it to id const
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        const getOneData = async () => {
            try{
                  
                await axios.get(`http://localhost:8000/stock/item/${id}`)
                .then((res) => {
                    setItemName(res.data.Item.itemName);
                    setQuantity(res.data.Item.quantity);
                    setCurrentStockLevel(res.data.Item.currentstocklevel);
                    setMinStockLevel(res.data.Item.minstocklevel);
                    console.log("✨ Item fetched successfuly!");
                })
                .catch((err) => {
                    console.log("☠ :: Error on API URL : " + err.message);
                })
            }catch (err){
                console.log('☠ :: handleDelete function failed! ERROR: ' + err.message);
            }
        }

        getOneData();

    }, [id])

    const updateData = async (e) => {
        e.preventDefault();

        try {
            let updateStockData = {
                itemName: itemName,
                quantity: quantity,
                currentstocklevel: currentstocklevel,
                minstocklevel: minstocklevel,
            };

            await axios.patch(`http://localhost:8000/stock/itemUpdate/${id}`, updateStockData)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
                navigate('/items');
            })
            .catch((err) => {
                console.log("☠ :: Error on API URL or updateItemData object: " +err.message);
            })

            // Clear form fields after successful submission(fields in form are empty)
            setItemName('');
            setQuantity('');
            setCurrentStockLevel('');
            setMinStockLevel('');

        } catch (error) {
            console.error("💀 :: sendData Function failed! ERROR :", error.message);
            
        }
    };
    
    return (
        <div className="updateFormContainer" style={{marginBottom: "75px", marginTop: "150px"}}>
            <div className="updateformBootstrap">
                <h2>Update Form</h2>

                <form onSubmit={updateData}>
                    <div className="form-group mb-3">
                        <label For="itemName">Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="itemName"
                            placeholder="Name"
                            onChange={(e) => setItemName(e.target.value) } value={itemName}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label For="quantity">Quantity:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label For="currentStockLevel">Current Stock Level:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="currentStockLevel"
                            placeholder="Current Stock Level"
                            value={currentstocklevel}
                            onChange={(e) => setCurrentStockLevel(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label For="minStockLevel">Minimum Stock Level:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="minStockLevel"
                            placeholder="Minimum Stock Level"
                            value={minstocklevel}
                            onChange={(e) => setMinStockLevel(e.target.value)}
                            required
                        />
                    </div>
                    <div className="updatebtndiv">
                        <button type="submit" className="btn btn-primary submitbtn">Submit</button>
                    </div>
                </form>
            
           
            
        </div>
        
        </div>
    );
};

export default StockUpdateForm;
