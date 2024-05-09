import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './DataTable.css';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';

function AllFeedbacks() {
    const [appointments, setAppointments] = useState([]);
    const [name, setName] = useState('');
    const [FeedbacksAllOriginal, setFeedbacksAllOriginal] = useState([]);
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
            } catch (error) {
                alert(error.message);
            }
        }

        getAppointments();
    }, [navigate]);

    const SearchFunction = async (searchTerm) => {
        try {
            const response = await axios.get('http://localhost:8000/customer/feedbacksearch', {
                params: {
                    DayVisited: searchTerm
                }
            });
            setAppointments(response.data.searchedFeedback);
        } catch (error) {
            console.log("Error on response from server:", error.message);
        }
    }

    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;
        setName(searchTerm);

        if (searchTerm === '') {
            setAppointments(FeedbacksAllOriginal);
        } else {
            await SearchFunction(searchTerm);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(name);
    };
    const Star = ({ selected = false }) => (
        <span style={{ color: selected ? 'gold' : 'grey' }}>★</span>
    );

    const generatePDFReport = () => {
        const doc = new jsPDF();
        
        // Add logo image
        const logo = new Image();
        logo.src = process.env.PUBLIC_URL + '/favicon.png'; // Path to your logo image
        doc.addImage(logo, 'PNG', 10, 10, 20, 20); // Add logo image at position (10, 10) with size 40x40
    
        // Add report title
        doc.text("Feedbacks Report", 60, 30);
    
        // Define table columns
        const columns = [
            { header: 'Id', dataKey: 'id' },
            { header: 'Day Visited', dataKey: 'dayVisited' },
            { header: 'Time Visited', dataKey: 'timeVisited' },
            { header: 'Comment', dataKey: 'comment' },
            { header: 'Rating', dataKey: 'rating' }, // Fixed typo here
        ];
    
        // Map appointment data to table rows
        const rows = appointments.map((appointment, index) => ({
            id: index + 1,
            dayVisited: appointment.DayVisited,
            timeVisited: appointment.TimeVisited,
            comment: appointment.Comment,
            rating: appointment.rating, // Rating column without stars
        }));
    
        // Add table to the document below the logo and title
        doc.autoTable({
            columns: columns, // Specify columns as an array of objects
            body: rows, // Specify rows as an array of objects
            startY: 50, // Adjust vertical position of the table
            margin: { top: 50 }, // Ensure sufficient margin to avoid overlap
            headStyles: {
                fillColor: [171, 132, 91], // Yellow background color for table headers
                textColor: [255, 255, 255], // White text color for table headers
                fontStyle: 'bold', // Bold font style for table headers
            },
            alternateRowStyles: {
                fillColor: [255, 255, 204] // Light yellow background color for alternate rows
            },
        });
    
        doc.save("feedbacks_report.pdf");
    };
    
    const logout = () => {
        localStorage.clear();
        navigate('/');
    }
    const handleUpdate = (id) => {
        
    };

    return (
        <div className='alldiv'>
            <div className="maintablecontainer">
                <div className="tablecontainer">
                    <div className="tableHead">
                        <div className="search-container">
                            <form className="searchTable" onSubmit={handleFormSubmit}>
                                <input id="searchBar" type="text" value={name} onChange={handleSearchChange} placeholder="Search.." name="search" />
                                <button type="submit"><i className="fa fa-search" style={{ color: "#ffffff" }}></i></button>
                            </form>
                        </div>
                    </div>
                    <div className="logoutdiv"><button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button></div>
                    <div className="reportdiv">
                        <button className="btn btn-primary btn-lg ReportBtn" onClick={generatePDFReport}>Generate PDF Report</button>
                    </div>
                    <div className="tablediv">
                        <table className="table table-striped tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Day Visited</th>
                                    <th scope="col">Time Visited</th>
                                    <th scope="col">Comment</th>
                                    <th scope="col">Rating</th>
                                    {/* <th scope="col">Likes</th>
                                    <th scope="col">DisLikes</th> */}
                                    <th scope="col">Reply</th>
                                    <th scope="col">Action</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment, index) => (
                                    <tr key={appointment._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{appointment.DayVisited}</td>
                                        <td>{appointment.TimeVisited}</td>
                                        <td>{appointment.Comment}</td>
                                        <td>{appointment.rating}<p> 
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} selected={star <= appointment.rating} />
                                            ))}
                                        </p></td>
                                        {/* <td>{appointment.likes}</td>
                                        <td>{appointment.dislikes}</td> */}
                                        <td>{appointment.reply}</td>
                                        <td>
    <Link to={`/feedback-reply/${appointment._id}`}>
        <button className="btn btn-warning">Reply</button>
    </Link>
</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllFeedbacks;
