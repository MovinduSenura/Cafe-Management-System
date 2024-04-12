import React,{ useState, useEffect } from "react";
import axios from 'axios';
import {Link}from"react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
//import {useNavigate} from "react-router-dom"


const AllPromotions = ()=> {

    const [ allPromotions, setAllPromotion ] = useState([]);

    useEffect(() => {

      const getAllPromotions = async () => {
        try{
          
          await axios.get('http://localhost:8000/promotion/promotions')
          .then((res) => {
            setAllPromotion(res.data.Allpromotions);
            console.log(res.data.Allpromotions);
            console.log('status: ' + res.data.status);
          })
          .catch((err) => {
            console.log('☠️ :: Error on API URL! ERROR: ', err.message);
          })

        }catch(err) {
         
          console.log('☠️ :: getAllPromotions function failed! ERROR: ' + err.message)
        }
      }

      getAllPromotions();

    }, [])


       const handledelete = async (id) =>{

            try{

              const confirmed  = window.confirm('Are you sure you want to delete this item?');
              
              if(confirmed){
                 await axios.delete(`http://localhost:8000/promotion/deletepromotion/${id}`)
                .then((res) => {
                alert(res.data.message);
                console.log(res.data.message);
               })
               .catch((err) => {
                console.log('☠️ :: Error on API URL : ' +err.message);
               })            
              
       }else {
        toast.warning('Deletion cancelled');
        console.log('Delection cancelled');
       }
      
      }catch(err){
        console.log('☠️ :: handleDelete function failed ! ERROR:'+err.message);
      }
       }

    return (
        
        <div className = "allPromotionscontainer">

        <table class = "table">
        <thead>
        <tr>
        <th scope="col">No</th>
        <th scope="col">PromotionID</th>
        <th scope="col">Name</th>
        <th scope="col">Value</th>
        <th scope="col">Discription</th>
        <th scope="col">Item Pic</th>
        <th scope="col"></th>
        </tr>
        </thead>

        <ToastContainer/>
      <tbody>
        {allPromotions.map((promotion) => (
          <tr>
            <th scope="row" key={promotion._id}>1</th>
            <td>{promotion._id}</td>
            <td>{promotion.promotionName}</td>
            <td>{promotion.promotionValues}</td>
            <td>{promotion.promotionDescription}</td>
            <td>{promotion.promotionItempic}</td>
            <td>
              <tbody>
                <tr>
                  <td><Link to={`/updateform/${promotion._id}`}><button type="button" className="btn btn-warning">Edit</button></Link></td> &nbsp;
                  <td><button type="button" className="btn btn-danger" onClick={() => handledelete(promotion._id)}>Delete</button></td>
                </tr>
              </tbody>
            </td>
          </tr>
        ))}
      </tbody>
        
        </table>
        </div>
    )

};
export default AllPromotions;