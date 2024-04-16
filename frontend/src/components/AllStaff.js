import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import { useNavigate} from "reac"
import './DataTable.css'

const AllStaff = () => {

    const[ allStaff, setAllStaff ]= useState([]);
    const[allOriginalStaff,setAllOriginalStaff]=useState([]);
    const[staffName,setStaffName] = useState('');

    useEffect(() => {

        const getAllStaff = async () => {

            try{

                await axios.get('http://localhost:8000/staff/staff')
                .then((res) => {
                    setAllStaff(res.data.AllStaff);
                    setAllOriginalStaff(res.data.AllStaff);
                    console.log(res.data.message);
                    console.log('status :' + res.data.status);
                
            })
            .catch((err) => {
                console.log("☠️ :: Error on API URL! ERROR :",err.message);
            })
           
          
        }catch(err){
               console.log("☠️ :: Error on API URL! ERROR : " +  err.message);

            }
        }

        getAllStaff();
           

    }, [])


    const handleDelete = async (id)=>{
        try{

            const confirmed = window.confirm('Are you sure you want to delete this item?');

            if(confirmed){
                await axios.delete(`http://localhost:8000/staff/deletestaff/${id}`)
                .then((res) => {
                    alert(res.data.message);
                    console.log(res.data.message);

                })
                .catch((err) =>{
                    console.log('☠️ :: Error on API URL :' + err.message);

                })
            }else{
                toast.warning('Deletion cancelled!');
                console.log('Deletion cancelled!');
            }
        }catch(err){
            console.log('☠️ :: handleDelete funnction failed! ERROR: ' +err.message);
        }
    }

    //search function begin

    const SearchFunction = async (searchTerm) => {
        // e.preventDefault();

        try{
            await axios.get('http://localhost:8000/staff/searchStaff', {
            params: {
                staffName: searchTerm
            }})
            .then((res) => {
                if(res.data.searchedStaff.length === 0){
                    setAllStaff(res.data.searchedStaff);
                    
                }
                else{
                    setAllStaff(res.data.searchedStaff);
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
        setStaffName(searchTerm);

        if (searchTerm === '') { // when placeholder empty fetch all data
             setAllStaff(allOriginalStaff); // Fetch all data when search term is empty
            
        } else {
            await SearchFunction(searchTerm);
            
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(staffName);
    };

    return (
     <div className="alldiv">
       <ToastContainer/>
        
          <div className="maintableContainer">

              <div className="tableHead">
                {/* <h2>Controller</h2> */}

                <div className="search-container">
                  <form className="searchTable" onSubmit={handleFormSubmit}>
                    <input id="searchBar" type="text" value={staffName} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                    <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                  </form>
                </div>
              </div>

              <div className="tablecontainer">
              <div className="logoutdiv"><Link to='/createStaff'><button type="button" className="btn btn-secondary btn-lg LogoutBtn">Logout</button></Link></div>
              <div className="addbtndiv"><Link to='/createStaff'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Member</button></Link></div>
              <div className="tablediv">

        <table class="table table-striped tbl">
          <thead>
             <tr>
                <th scope="col">No.</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Contact No.</th>
                <th scope="col">Address</th>
                <th scope="col">Age</th>
                <th scope="col">Gender</th>
                <th scope="col">Salary Per Hours</th>
                <th scope="col">Worked Hours</th>
                <th className="op" scope="col">Operations</th>
                <th scope="col"></th> 
     
             </tr>
          </thead>
       <tbody>
          {allStaff.map((staff, index) => (
             <tr key={staff._id}>
                <th scope="row">{index + 1}</th>
                <td>{staff.staffName}</td>
                <td>{staff.staffEmail}</td>
                <td>{staff.staffContactNo}</td>
                <td>{staff.staffAddress}</td>
                <td>{staff.staffAge}</td>
                <td>{staff.staffGender}</td>
                <td>{staff.staffSalaryPerHours}</td>
                <td>{staff.staffWorkedHours}</td>
                
                
                <td>
                    <table className="EditDeleteBTNs">
                        <tbody>
                            <tr>
                               <td> <Link to={`/staffUpdateform/${staff._id}`}><button type="button" className="btn btn-success">Edit</button></Link></td>&nbsp;&nbsp;
                                <td><button type="button" class="btn btn-danger" onClick={() => handleDelete(staff._id)} >Delete</button></td>
                                
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

export default AllStaff;