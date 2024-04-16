import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

//import AddFeedback from './AddFeedback';

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
        <div style={styles.container}>

            
            <div style={styles.userData}>
                <h2>User Data for NIC: {customerNIC}</h2>
                <p>Customer Full Name: {userData.customerFullName}</p>
                <p>Customer Email: {userData.customerEmail}</p>
                <p>Customer Contact No: {userData.customerContactNo}</p>
                <p>Customer Gender: {userData.customerGender}</p>
                <p>Customer NIC: {userData.customerNIC}</p>
                <p>Customer Address: {userData.customerAddress}</p>
                <p>Customer Loyalty Points: {userData.customerLoyaltyPoints}</p>
               
            </div>
            <button onClick={() => handleAddFeedback(userData._id)} style={styles.button}>Go to Add Feedback</button>
            <div style={styles.feedbackContainer}>
                <h3>Added Feedbacks</h3>
                {userData.feedbacks.length > 0 ? (
                    <ul style={styles.feedbackList}>
                        {userData.feedbacks.map((feedback) => (
                            <li key={feedback._id} style={styles.feedbackItem}>
                                <p>Day Visited: {feedback.DayVisited}</p>
                                <p>Time Visited: {feedback.TimeVisited}</p>
                                <p>Comment: {feedback.Comment}</p>
                                <div style={styles.feedbackButtons}>
                                    <a href={`/feedback/${userData.customerNIC}/${feedback._id}`}>
                                        <button style={{ marginRight: '10px' }}>Update</button>
                                    </a>
                                    <button onClick={() => handleDeleteFeedback(feedback._id)} style={styles.deleteButton}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No feedbacks available</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
    },
    button: {
        marginBottom: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    userData: {
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    feedbackContainer: {
        marginBottom: '20px',
    },
    feedbackList: {
        listStyleType: 'none',
        padding: 0,
    },
    feedbackItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '20px',
    },
    feedbackButtons: {
        marginTop: '10px',
    },
    updateButton: {
        marginRight: '10px',
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default UserData;