import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function FeedbackReply() {
    const { feedbackId } = useParams(); // Correct usage of useParams
    const [feedback, setFeedback] = useState({});
    const [reply, setReply] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!feedbackId) {
            console.log('Feedback ID is missing'); // Debug: Check if feedbackId is missing
            navigate('/');
            return;
        }

        async function fetchFeedback() {
            try {
                console.log(`Fetching feedback with ID: ${feedbackId}`); // Debugging output
                const response = await axios.get(`http://localhost:8000/customer/userfeedback/${feedbackId}`);
                console.log('Feedback data received:', response.data); // Debugging output
                setFeedback(response.data.feedback);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                alert('Failed to fetch feedback details.');
            }
        }

        fetchFeedback();
    }, [feedbackId, navigate]);

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/customer/feedback/${feedbackId}/reply`, { reply });
            alert('Reply successfully submitted!');
            navigate('/allfeedback');
        } catch (error) {
            console.error('Error submitting reply:', error);
            alert('Failed to submit reply.');
        }
    };
    

    return (
        <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
            <h1 style={{fontSize:"60px"}}>Reply to Feedback</h1>
            <br></br>
            <br></br>
            <div>
                <h3 style={{fontSize: "25px" }}>Customer Comment:</h3>
                <p  style={{maxWidth:"800px" ,fontSize:"20px"}}>{feedback.Comment}</p>
               
            </div>
            <p style={{fontSize: "25px" ,marginTop: "40px" }}> Reply:</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={reply}
                    onChange={handleReplyChange}
                    placeholder="Write your reply here..."
                    rows="4"
                    cols="50"
                />
                <br></br>
                <br></br>
                <button  className="btn btn-warning" style={{backgroundColor:"#AB845B", color: "white" ,marginLeft:"150px", borderRadius:"7px", borderColor: "#AB845B"}} type="submit">Submit Reply</button>

            </form>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
        </div>
    );
}

export default FeedbackReply;
