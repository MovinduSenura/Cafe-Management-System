import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import menuicons from '../images/menuicons.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import './UserData.css';

const UserData = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const { customerNIC } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/customer/login/${customerNIC}`);
                setUserData(response.data.user);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [customerNIC]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const Star = ({ selected = false }) => (
        <span style={{ color: selected ? 'gold' : 'grey' }}>★</span>
    );

    const handleDeleteFeedback = async (feedbackId) => {
        try {
            await axios.delete(`http://localhost:8000/customer/deletefeedback/${userData._id}/${feedbackId}`);
            alert("Feedback Deleted!");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("Failed To Delete Feedback!");
        }
    };

    const handleAddFeedback = () => {
        navigate(`/add/${userData._id}`);
    };

    return (
        <div className="feedbackitemsmaindiv">
            <div className="SectorFeedback">
                <div className="SecOverlay3">
                    <div className="SectorAlignDiv3">
                        <div className='leftside'>
                            <div className="feedbackInfoContainer">
                                <h1>Feedback</h1>
                            </div>
                            <div className="feedbackIconsContainer">
                                <img src={menuicons} alt="menu icons" />
                            </div>
                        </div>
                        <div className='rightside'>
                            <div className='cusdetails'>
                                <h4>User Data for NIC: {customerNIC}</h4>
                                <p>Customer Full Name: {userData.customerFullName}</p>
                                <p>Customer Email: {userData.customerEmail}</p>
                                <p>Customer Contact No: {userData.customerContactNo}</p>
                                <p>Customer Gender: {userData.customerGender}</p>
                                <p>Customer NIC: {userData.customerNIC}</p>
                                <p>Customer Address: {userData.customerAddress}</p>
                                <p>Customer Loyalty Points: {userData.customerLoyaltyPoints}</p> 
                            </div>
                            <div className='addfeedbackbtn'>
                                <button onClick={handleAddFeedback} className="btn btn-primary feedbackbtn">Send Feedback</button>
                            </div>
                            <div className='arrowbtndiv'>
                                <a href='/allcustomerfeedbacks'>
                                    <o className='otag'>Ratings & Reviews</o>
                                    <button className="btn btn-success arrowbtn">
                                        <FontAwesomeIcon icon={faAngleRight} />
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='cusprof'>
                <div className='ownfeedbackdiv'>
                    <h2>YOUR FEEDBACKS</h2>
                    {userData.feedbacks && userData.feedbacks.length > 0 ? (
                        <div className='onefeeddiv'>
                            {userData.feedbacks.map((feedback) => (
                                <div className='onefeedsubdiv' key={feedback._id}>
                                    <div className='det'>
                                        <p>Day Visited: {feedback.DayVisited}</p>
                                        <p>Time Visited: {feedback.TimeVisited}</p>
                                        <p>Comment: {feedback.Comment}</p>
                                        <p>
                                            Rating: 
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} selected={star <= feedback.rating} />
                                            ))}
                                        </p>
                                        <p className='replycolor' style={{color:"brown" ,fontWeight: "500"}}>Reply - {feedback.reply}</p>
                                    </div>
                                    <div className='feededitdelbtns'>
                                        <a href={`/feedback/${userData.customerNIC}/${feedback._id}`}>
                                            <button className="btn btn-success feedbtn1">
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                        </a>
                                        <button className="btn btn-danger feedbtn2" onClick={() => handleDeleteFeedback(feedback._id)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No feedbacks available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserData;
