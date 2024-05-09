// 
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import './AddFeedback.css';

const AddFeedback = () => {
    const [feedbackData, setFeedbackData] = useState({
        DayVisited: '',
        TimeVisited: '',
        Comment: '',
        rating: 0
    });

    const { userid } = useParams();

    const [errorMessage, setErrorMessage] = useState('');
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRatingChange = newRating => {
        setFeedbackData({ ...feedbackData, rating: newRating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedbackData.DayVisited || !feedbackData.TimeVisited || !feedbackData.Comment ) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        try {
            await axios.post(`http://localhost:8000/customer/addfeedback/${userid}`, feedbackData);
            alert("Feedback Added Successfully!");
            
            setFeedbackData({
                DayVisited: '',
                TimeVisited: '',
                Comment: '',
                rating: 0
            });
            // Optionally, redirect the user to another page after successful feedback submission
        } catch (error) {
            console.error("Error adding feedback:", error);
            alert("Failed to add feedback. Please try again.");
        }
    };

    const getMaxDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <div className="createFormContainer2">
            <div className="formBootstrap2">
                <h2>Create Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="DayVisited">Day Visited</label>
                        <input type="date" className="form-control" id="DayVisited" name="DayVisited" value={feedbackData.DayVisited} onChange={handleInputChange} max={getMaxDate()} required />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="TimeVisited">Time Visited</label>
                        <input type="time" className="form-control" id="TimeVisited" name="TimeVisited" value={feedbackData.TimeVisited} onChange={handleInputChange} min="08:00" max="21:00" required />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="Comment">Comment</label>
                        <textarea id="Comment" className="form-control" name="Comment" value={feedbackData.Comment} onChange={handleInputChange} required></textarea>
                    </div>
                    <div className="rating">
                        <p>Rate us:</p>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                selected={star <= feedbackData.rating}
                                onClick={() => handleRatingChange(star)}
                            />
                        ))}
                    </div>
                    <div className="submitbtndiv2">
                        <button type="submit" className="btn btn-primary submitbtn2">Submit Feedback</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Star = ({ selected = false, onClick }) => (
    <span className={selected ? 'star selected' : 'star'} onClick={onClick}>
        ★
    </span>
);

export default AddFeedback;
