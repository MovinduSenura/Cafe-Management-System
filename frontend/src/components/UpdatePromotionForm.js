import React from "react";
import { useState , useEffect, useRef } from "react";
import axios from 'axios';
// import './PromotionCreateForm.css'
import { useParams, useNavigate} from "react-router-dom";
import './UpdateForm.css'


const UpdatePromotionForm = () => {
    
    const[promotionName, setpromotionName]= useState('');
    const [uploadedFileName, setUploadedFileName] = useState(''); // State to store uploaded file name
    const[promotionValues, setpromotionValues]= useState('');
    const[promotionDescription, setpromotionDescription]= useState('');
    // const[promotionItempic, setpromotionItempic]= useState('');
    const fileInputRef = useRef(null); // Create a ref for file input
 
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
            setUploadedFileName(res.data.Promotion.promotionItempic);
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

        const promotionformdata = new FormData(); // Create menuformdata object to append data
        // menuformdata.append('menuItemImage', menuItemImage);
        promotionformdata.append('promotionName', promotionName);
        promotionformdata.append('promotionValues', promotionValues);
        promotionformdata.append('promotionDescription', promotionDescription);
        promotionformdata.append('promotionItempic', fileInputRef.current.files[0]); // Retrieve file from file input ref

            
        try{

            // let updateItemData = {
            //     promotionName: promotionName,
            //     promotionValues: promotionValues,
            //     promotionDescription: promotionDescription,
            //     promotionItempic: promotionItempic,
            // }
            axios.patch(`http://localhost:8000/promotion/promotionUpdate/${id}`,promotionformdata)
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
            <div className="form-group mb-3">
                       
                       <label for="promotionImage">Promotion Image:</label>
                           {/* <input type="file" accept="image/*" className="form-control" id="menuItemImage" placeholder="Enter menuItemImage" autoComplete="off" onChange={(e) => setmenuItemImage(e.target.files[0])}/> */}
                       <input type="file" accept="image/*" className="form-control" id="promotionImage"  autoComplete="off" ref={fileInputRef} />
                       {uploadedFileName && <p>Uploaded File: {uploadedFileName}</p>} 
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