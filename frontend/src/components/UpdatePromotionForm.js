import React from "react";
import { useState , useEffect } from "react";
import axios from 'axios';
// import './PromotionCreateForm.css'
import { useParams, useNavigate} from "react-router-dom";
import './UpdateForm.css'


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
        

        <div className="updateFormContainer" style={{marginBottom: "75px", marginTop: "150px"}}>
            <div className="updateformBootstrap">
                <h2>Update Form</h2>
                
                <form onSubmit={updateData}>
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
            <div class="form-group mb-3">
                <label for="promotionItempic">Item Pic:</label>
                <input type="text" className="form-control" id="promotionItempic" placeholder="pic" autoComplete="off" onChange={
                    (e) => {
                        setpromotionItempic(e.target.value)
                    }
                       
                }    value={promotionItempic}/>
            </div>
            <div className="updatebtndiv">
            <button type="submit" className="btn btn-primary submitbtn">Submit</button>
            </div>
            </form>
            </div>


    </div>

    )  
};

export default UpdatePromotionForm;