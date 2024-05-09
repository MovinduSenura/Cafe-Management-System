import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

import './DataTable.css';

//getAll
const ProfitAll = () => {

  const[ ProfitAll, setProfitAll ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }
    const getAllProfits = async () => {

      try{
        await axios.get('http://localhost:8000/profit/getAllProfit')
        .then((res) => {
          setProfitAll(res.data.allProfits);
          console.log(res.data.message);
          console.log('status : '+res.data.status);
        }).catch((err) => {
          console.log("💀 :: Error on API URL! ERROR : ",err.message);
        })
      }catch(err){
        console.log("💀 :: getAllProfits function failed!"+err.message);
      }
    }
    

    getAllProfits();

  },[])


  const logout = (e) => {
    localStorage.clear()
    navigate('/')
}


  return (
    <div className="alldiv" style={{marginTop: "150px"}}>

    <div className="maintablecontainer">


        <div className = "tablecontainer">
            <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
            <div className="addbtndiv"><Link to='/createProfit'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Profit</button></Link></div>
        <div className="tablediv">

        <table className="table table-striped tbl">
            <thead>
                <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Date</th>
                      <th scope="col">Income</th>
                      <th scope="col">Salary</th>
                      <th scope="col">Other</th>
                      <th scope="col">Profit</th>
                      <th scope="col" className='op'>Operations</th>

                </tr>
            </thead>
            <tbody>
            {ProfitAll.map((profits,index) => (
                      <tr key={profits._id}>
                      <th scope="row">{index+1}</th>
                      <td>{moment(profits.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                      <td>{profits.income}</td>
                      <td>{profits.salary}</td>
                      <td>{profits.other}</td>
                      <td>{profits.profit}</td>
                      <td>
                          <table className="EditDeleteBTNs">
                              <tbody>
                                  <tr>
                                      <td><Link to={`/updateProfit/${profits._id}`}><button type="button" className="btn btn-success">Edit</button></Link></td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                        
                    </tr>
                ))}

            </tbody>
        </table>
        </div>
        </div>
    </div>
</div>
  )
};

export default ProfitAll;

