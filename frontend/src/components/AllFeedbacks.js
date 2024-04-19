import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
import './DataTable.css'
 
function AllFeedbacks() {

    // const [FeedbacksAll, setFeedbacksAll ]= useState([]);
    const [appointments, setAppointments] = useState([]);
    const [name, setName] = useState('');
    const [FeedbacksAllOriginal, setFeedbacksAllOriginal]= useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

        async function getAppointments() {
            try {
                const response = await axios.get("http://localhost:8000/customer/feedbackall");
                setAppointments(response.data.feedbacks);
                setFeedbacksAllOriginal(response.data.feedbacks);
                console.log(response.data.feedbacks)
            } catch (error) {
                alert(error.message);
            }
        }
 
        getAppointments();
    }, [navigate]);

    const SearchFunction = async (searchTerm) => {
        // e.preventDefault();
  
        try{
            await axios.get('http://localhost:8000/customer/feedbacksearch', {
            params: {
                DayVisited: searchTerm
            }})
            .then((res) => {
                if(res.data.searchedFeedback.length === 0){
                    setAppointments(res.data.searchedFeedback);
                }
                else{
                    setAppointments(res.data.searchedFeedback);
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
        setName(searchTerm);
  
        if (searchTerm === '') { // when placeholder empty fetch all data
            setAppointments(FeedbacksAllOriginal); // Fetch all data when search term is empty
            
        } else {
            await SearchFunction(searchTerm);
        }
    };
  
    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(name);
    };

    const logout = (e) => {
        localStorage.clear()
        navigate('/')
    }
    
  return (
    <div className='alldiv'>
        {/* <h2>Feedbacks</h2> */}
    {/* <br />
    <br /><br />
    <center>
        <h1 className='mb-5'>Appointment Details</h1>
    </center>
    <br /> */}
        <div className="maintablecontainer">
            <div className = "tablecontainer">

                <div className="tableHead">
                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={name} onChange={handleSearchChange} placeholder="Search.." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
                        </form>
                    </div>
                </div>

                <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
                {/* <div className="addbtndiv"><Link to='/menucreateform'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Item</button></Link></div>             */}
                <div className="tablediv">

                    <table className="table table-striped tbl">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Day Visited</th>
                                <th scope="col">Time Visited</th>
                                <th scope="col">Comment</th>
                                {/* <th scope="col" colSpan={2} style={actionCellStyle}>Action</th> */}
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={appointment._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{appointment.DayVisited}</td>
                                    <td>{appointment.TimeVisited}</td>
                                    <td>{appointment.Comment}</td>
                                    {/* <td style={actionCellStyle}> */}
                                        {/* <button className='btn btn-success' onClick={OnUpdate}>UPDATE</button> */}
                                        {/* <a href={`update/${appointment._id}`}>
                                            <button type="button" className="btn btn-outline-primary">Update</button>
                                        </a> */}
                                    {/* </td>
                                    <td style={actionCellStyle}>
                                        <button className='btn btn-outline-danger'>DELETE</button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AllFeedbacks