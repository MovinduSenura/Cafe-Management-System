import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import { useNavigate} from "reac"
import './DataTable.css'

const AllStaff = () => {

    const[ allStaff, setAllStaff ]= useState([]);
    const[allOriginalStaff,setAllOriginalStaff]=useState([]);
    const[staffName,setStaffName] = useState('');
    const [bestEmployee, setBestEmployee] = useState(null); // Define bestEmployee in state

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

        const getAllStaff = async () => {

            try{

                await axios.get('http://localhost:8000/staff/staff')
                .then((res) => {
                    setAllStaff(res.data.AllStaff);
                    setAllOriginalStaff(res.data.AllStaff);
                    setBestEmployee(res.data.BestEmployee); // Set bestEmployee from backend data
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
           

    }, [navigate])


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

    const logout = (e) => {
        localStorage.clear()
        navigate('/')
    }

     //generate Invoice
  const downloadInvoice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/generate-invoice"
      );

      const { filepath } = response.data;

      // Create a new <a> element to simulate a download link
      const link = document.createElement("a");
      // Set the href attribute of the link to the filepath of the generated invoice
      link.href = filepath;
      // Set the "download" attribute to specify the default file name for the downloaded file
      link.setAttribute("download", "invoice.pdf");
      // Append the link to the document body
      document.body.appendChild(link);

      // Simulate a click on the link to trigger the download
      link.click();

       // Remove the link from the document body after the download is complete
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error.message);
    }
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
              <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
              <div className="addbtndiv"><Link to='/createStaff'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Member</button></Link></div>
              <div className="tablediv">
              <button type="button" className="btn btn-secondary btn-lg ReportBtn" onClick={downloadInvoice}> Download Staff Details </button>

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
                <th scope="col">Salary Per Hours (LKR)</th>
                <th scope="col">Worked Hours</th>
                <th className="op" scope="col">Operations</th>
                <th scope="col"></th> 
     
             </tr>
          </thead>
       <tbody>
          {allStaff.map((staff, index) => (
             <tr key={staff._id}>
                <th scope="row">{index + 1}</th>
                <td>
                    {staff.staffName} <br/>
                    {staff.staffWorkedHours === bestEmployee.staffWorkedHours && (
                        <span className="popularLabel">Best Employee</span>
                    )}
                </td>
                
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