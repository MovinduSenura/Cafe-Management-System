import React from "react";
import { useState , useEffect } from "react";
import axios from 'axios';
import './PromotionCreateForm.css'
import { useParams, useNavigate} from "react-router-dom";


const UpdatePromotionForm = () => {
    
    const[promotionName, setpromotionName]= useState('');
    const[promotionValues, setpromotionValues]= useState('');
    const[promotionDescription, setpromotionDescription]= useState('');
    const[promotionItempic, setpromotionItempic]= useState('');
 
    const {id} = useParams();
    const navigate = useNavigate();
    

    useEffect(() => {

        const getOneData = async () => {
            try{

                await axios.get(`http://localhost:8000/promotion/promotion/${id}`)
                .then((res) => {
            setpromotionName(res.data.Promotion.promotionName);
            setpromotionValues(res.data.Promotion.promotionValues);
            setpromotionDescription(res.data.Promotion.promotionDescription);
            setpromotionItempic(res.data.Promotion.promotionItempic);
            console.log("✨ Promotion fetched successfuly!");
                })
                .catch((err)=> {
                    console.log("☠️ :: Error on API URL :" +err.message);
                })
            }catch(err){
                console.log("☠️ ::getOnepromotion Function failed! ERROR :" +err.message);
            }

        }
         
        getOneData();

    },[id])

    const updateData = (e) => {
        e.preventDefault();
            
        try{
            let updateItemData = {
                promotionName: promotionName,
                promotionValues: promotionValues,
                promotionDescription: promotionDescription,
                promotionItempic: promotionItempic,
            }
            axios.patch(`http://localhost:8000/promotion/promotionUpdate/${id}`,updateItemData)
            .then((res) =>{
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
                navigate('/allpromotion');

            })
            .catch((err) => {
                console.log("☠️:: Error on APIURL or newpromotionData object:"+err.message);
            })
           
           
        }catch(err){
            console.log("☠️::sendData Function failed ERROR :"+ err.message);
        }
            
        
    }
     

    return (
        

        <div className="promotioncreateFormContainer">
            <div classNme="formBootstrap">
                <h2 className="mb-4">Update Form</h2>
                
                <form onSubmit={updateData}>
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
            
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>


    </div>

    )  
};

export default UpdatePromotionForm;