import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

//import CSS files
import './DataTable.css'

//getAll
export const PaymentAll = () => {

  const[ PaymentAll, setPaymentAll ] = useState([]);
  const[ allOriginalPayments, setallOriginalPayments] = useState([]);
  const[ orderID, setorderID ] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const getAllPayments = async () => {

      const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

      try{
        await axios.get('http://localhost:8000/payment/getAllPayment')
        .then((res) => {
          setPaymentAll(res.data.allPayments);
          setallOriginalPayments(res.data.allPayments)
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

  },[navigate])


  //delete
  const handleDelete =  async(id) => {
    try{

      const confirmed = window.confirm('Are you sure you want to delete this payment record?');

      if(confirmed){
        await axios.delete(`http://localhost:8000/payment/deletePayment/${id}`)
        .then((res) => {
          alert(res.data.message);
          console.log(res.data.message);
          window.location.href=`/getAllPayment`;
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

  //search functions
  const SearchFunction = async (searchTerm) => {
    // e.preventDefault();

    try{
        await axios.get('http://localhost:8000/payment/searchPayment', {
        params: {
          orderID: searchTerm
        }})
        .then((res) => {
            if(res.data.searchPayment.length === 0){
              setPaymentAll(res.data.searchPayment);
                
            }
            else{
              setPaymentAll(res.data.searchPayment);
                console.log(res.data.message);
                
            }
        })
        .catch((error) => {
            console.log("☠️ :: Error on response from server! ERROR : ", error.message);
            
        })

    }catch(err){
        console.log("☠️ :: Error on axios API Request! ERROR : ", err.message);
       
    }
}


const handleSearchChange = async (e) => {
    const searchTerm = e.target.value;
    setorderID(searchTerm);

    if (searchTerm === '') { // when placeholder empty fetch all data
        setPaymentAll(allOriginalPayments); // Fetch all data when search term is empty
        
    } else {
        await SearchFunction(searchTerm);
       
    }
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    SearchFunction(orderID);
};

const calculateTotal = () => {
  let total = 0;

  // Iterate through each payment and sum up the amount
  PaymentAll.forEach(payment => {
      total += payment.amount;
  });

  return total;
}

const logout = (e) => {
  localStorage.clear()
  navigate('/')
}

  return (
    <div className='alldiv'>

      <div className='maintablecontainer'>

        <div className="tableHead">

          <div className="search-container">
              <form className="searchTable" onSubmit={handleFormSubmit}>
                  <input id="searchBar" type="text" value={orderID} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                  <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
              </form>
          </div>
        </div>

        <div className = "tablecontainer">
          <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
          {/* <div className="addbtndiv"><Link to='/create'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Payment</button></Link></div> */}
          <div className="tablediv">
        {/* <div>
          <Link to='/create'>
            <button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add item</button>
          </Link>
        </div> */}
        <ToastContainer/>
                  <table className="table table-striped tbl">
                  <thead>
                      <tr>
                      <th scope="col">No</th>
                      <th scope="col">OrderID</th>
                      <th scope="col">PromotionID</th>
                      <th scope="col">Amount (LKR)</th>
                      <th scope="col">Date</th>
                      <th scope="col" className='op'>Operation</th>
                      
                      </tr>
                  </thead>
                  <tbody>
                    {PaymentAll.map((payments, index) => (
                      <tr key={payments._id}>
                      <th scope="row">{index+1}</th>
                      <td>{payments.orderID}</td>
                      <td>{payments.promotionID}</td>
                      <td>{payments.amount}</td>
                      <td>{moment(payments.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                      <td>
                        <table className='EditDeleteBTNs'>
                          <tbody>
                            <tr>
                              {/* <td>
                                <Link to={`/update/${payments._id}`}><button type="button" className="btn btn-success">Edit</button></Link>&nbsp;
                              </td> */}
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
                  <div>
                        <p>Total: <h3>{calculateTotal()} LKR</h3></p>
                    </div>
                  </div>
                  </div>
                </div>
      </div>
  )
};

export default PaymentAll;

