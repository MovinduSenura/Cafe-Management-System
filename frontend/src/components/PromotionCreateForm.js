import React from "react";
import { useState } from "react";
import axios from 'axios';
import './PromotionCreateForm.css'


const PromotionCreateForm = () =>{
    
    const[promotionName, setpromotionName]= useState('');
    const[promotionValues, setpromotionValues]= useState('');
    const[promotionDescription, setpromotionDescription]= useState('');
    const[promotionItempic, setpromotionItempic]= useState('');
 
    const sendData = (e) => {
        e.preventDefault();
            
        try{
            let newpromotionData = {
                promotionName: promotionName,
                promotionValues: promotionValues,
                promotionDescription: promotionDescription,
                promotionItempic: promotionItempic,
            }
            axios.post('http://localhost:8000/promotion/create',newpromotionData)
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
            setpromotionItempic('');
           
        }catch(err){
            console.log("☠️::sendData Function failed ERROR :"+ err.message);
        }
            
        
    }
     

    return (
        

        <div className="promotioncreateFormContainer">
            <div classNme="formBootstrap">
                <h1>Add Promotion</h1>
                <form onSubmit={sendData}>
            <div class="form-group">
                <label for="promotionName">Name</label>
                <input type="text" className="form-control" id="promotionName"  placeholder="Enter name" onChange={
                    (e) => {
                        setpromotionName(e.target.value)
                    }
                       
                }    value={promotionName}/>
            </div>
            <div class="form-group">
                <label for="promotionValues">Value</label>
                <input type="number"className="form-control" id="promotionValues" placeholder="value" onChange={
                    (e) => {
                        setpromotionValues(e.target.value)
                    }
                       
                }    value={promotionValues}/>
            </div>
            <div class="form-group">
                <label for="promotionDescription">Description</label>
                <input type="text"className="form-control" id="promotionDescription" placeholder="Enter decription" onChange={
                    (e) => {
                        setpromotionDescription(e.target.value)
                    }
                       
                }    value={promotionDescription}/>
            </div>
            <div class="form-group">
                <label for="promotionItempic">Item Pic</label>
                <input type="text" className="form-control" id="promotionItempic" placeholder="pic" onChange={
                    (e) => {
                        setpromotionItempic(e.target.value)
                    }
                       
                }    value={promotionItempic}/>
            </div>
            
            <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            </div>


    </div>

    )  
};

export default PromotionCreateForm;