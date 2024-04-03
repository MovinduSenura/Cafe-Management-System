import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import CSS files
import './PaymentAll.css'

//getAll
export const PaymentAll = () => {

  const[ PaymentAll, setPaymentAll ] = useState([]);

  useEffect(() => {
    const getAllPayments = async () => {

      try{
        await axios.get('http://localhost:8000/payment/')
        .then((res) => {
          setPaymentAll(res.data.allPayments);
          console.log(res.data.message);
          console.log('status : '+res.data.status);
        }).catch((err) => {
          console.log("💀 :: Error on API URL! ERROR : ",err.message);
        })
      }catch(err){
        console.log("💀 :: getAllPayments function failed!"+err.message);
      }
    }

    getAllPayments();

  },[])


  //delete
  const handleDelete =  async(id) => {
    try{

      const confirmed = window.confirm('Are you sure you want to delete this payment record?');

      if(confirmed){
        await axios.delete(`http://localhost:8000/payment/deletePayment/${id}`)
        .then((res) => {
          alert(res.data.message);
          console.log(res.data.message);
          window.location.href=`/`;
        })
        .catch((err) => {
          console.log('💀 :: Error on API URL : '+err.message);
        })
      }else{
        toast.warning('Deletion cancelled!');
        console.log('Deletion cancelled');
      }

    }catch(err){
      console.log('💀 :: handleDelete function failed! ERROR: '+err.message);

    }
  }


  return (
    <div className='tablecontainer'>
      <h1>Payments</h1>
      <div><Link to='/create'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add item</button></Link></div>
      <ToastContainer/>
                <table className="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">OrderID</th>
                    <th scope="col">PromotionID</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Date</th>
                    <th scope="col" className='op'>Operations</th>
                    
                    </tr>
                </thead>
                <tbody>
                  {PaymentAll.map((payments,index) => (
                    <tr key={payments._id}>
                    <td>{index+1}</td>
                    <td>{payments.orderID}</td>
                    <td>{payments.promotionID}</td>
                    <td>{payments.amount}</td>
                    <td>{payments.date}</td>
                    <td>
                      <table className='EditDeleteBTNs'>
                        <tbody>
                          <tr>
                            <td>
                              <Link to={`/update/${payments._id}`}><button type="button" className="btn btn-success">Edit</button></Link>&nbsp;
                            </td>
                            <td>
                              <button type="button" className="btn btn-danger" onClick={() => handleDelete(payments._id)}>Delete</button>
                            </td>
                          </tr>
                        </tbody>
                        
                      </table>
                    </td>
                    
                    </tr>

                  ))}
                    
                </tbody>
                </table>
      </div>
  )
};

export default PaymentAll;

