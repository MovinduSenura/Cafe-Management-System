import React from "react";
import { useState, useRef } from "react";
import axios from 'axios';
// import './PromotionCreateForm.css'
import './CreateForm.css'

const PromotionCreateForm = () =>{
    
    const[promotionName, setpromotionName]= useState('');
    const[promotionValues, setpromotionValues]= useState('');
    const[promotionDescription, setpromotionDescription]= useState('');
    // const[promotionItempic, setpromotionItempic]= useState('');
    const fileInputRef = useRef(null); // Create a ref for file input
    
    const sendData = (e) => {
        e.preventDefault();
            
        const promotionformdata = new FormData(); // Create menuformdata object to append data
        // menuformdata.append('menuItemImage', menuItemImage);
        promotionformdata.append('promotionName', promotionName);
        promotionformdata.append('promotionValues', promotionValues);
        promotionformdata.append('promotionDescription', promotionDescription);
        promotionformdata.append('promotionItempic', fileInputRef.current.files[0]); // Retrieve file from file input ref

        try{
            // let newpromotionData = {
            //     promotionName: promotionName,
            //     promotionValues: promotionValues,
            //     promotionDescription: promotionDescription,
            //     promotionItempic: promotionItempic,
            // }
            axios.post('http://localhost:8000/promotion/create',promotionformdata,  {headers: {'Content-Type': 'multipart/form-data'}})
            .then((res) =>{
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);

            })
            .catch((err) => {
                console.log("☠️:: Error on APIURL or newpromotionData object:"+err.message);
            })
            //set state back to first state
            setpromotionName('');
            setpromotionValues('');
            setpromotionDescription('');
            // setpromotionItempic('');
            fileInputRef.current.value = '';
           
        }catch(err){
            console.log("☠️::sendData Function failed ERROR :"+ err.message);
        }
            
        
    }
     

    return (
        

        <div className="createFormContainer" style={{marginBottom: "75px", marginTop: "150px"}}>

            <div className="formBootstrap">
                <h2>Add Promotion</h2>
                <form onSubmit={sendData}>
            <div class="form-group mb-3">
                <label for="promotionName">Name:</label>
                <input type="text" className="form-control" id="promotionName"  placeholder="Enter name" autoComplete="off" onChange={
                    (e) => {
                        setpromotionName(e.target.value)
                    }
                       
                }    value={promotionName}/>
            </div>
            <div class="form-group mb-3">
                <label for="promotionValues">Value:</label>
                <input type="number"className="form-control" id="promotionValues" placeholder="value" autoComplete="off" min={0} onChange={
                    (e) => {
                        setpromotionValues(e.target.value)
                    }
                       
                }    value={promotionValues}/>
            </div>
            <div class="form-group mb-3">
                <label for="promotionDescription">Description:</label>
                <input type="text"className="form-control" id="promotionDescription" placeholder="Enter decription" autoComplete="off" onChange={
                    (e) => {
                        setpromotionDescription(e.target.value)
                    }
                       
                }    value={promotionDescription}/>
            </div>
            <div className="form-group mb-3">
                       
                    <label for="promotionImage">Promotion Image:</label>
                        {/* <input type="file" accept="image/*" className="form-control" id="menuItemImage" placeholder="Enter menuItemImage" autoComplete="off" onChange={(e) => setmenuItemImage(e.target.files[0])}/> */}
                    <input type="file" accept="image/*" className="form-control" id="promotionImage"  autoComplete="off" ref={fileInputRef} required/>
            </div>
           
            <div className="submitbtndiv">
            <button type="submit" class="btn btn-primary submitbtn">Submit</button>
            </div>
            </form>
            </div>


    </div>

    )  
};

export default PromotionCreateForm;