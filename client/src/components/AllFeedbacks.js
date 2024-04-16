import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
 
const internalTable = {
    fontFamily: 'Helvetica',
    maxWidth: '80%',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '6px',
};
 
const actionCellStyle = {
    textAlign: 'center',
};
 
const tableHeaderStyle = {
    background: '#92a8d1',
    color: '#fff',
};

function AllFeedbacks() {


    const [appointments, setAppointments] = useState([]);
 
    useEffect(() => {
        async function getAppointments() {
            try {
                const response = await axios.get("http://localhost:8000/customer/feedback/all");
                setAppointments(response.data);
                console.log(response.data)
            } catch (error) {
                alert(error.message);
            }
        }
 
        getAppointments();
    }, []);
    
  return (
    <div className='p-3'>
    <br />
    <br /><br />
    <center>
        <h1 className='mb-5'>Appointment Details</h1>
    </center>
    <br />
    <div className="mb-3">
        <table className="table table-bordered table-hover" style={internalTable}>
            <thead style={tableHeaderStyle}>
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
                    <tr key={index}>
                        <td>{index + 1}</td>
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
  )
}

export default AllFeedbacks