import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FeedbackCreateForm.css'

const AddFeedback = () => {
    const [feedbackData, setFeedbackData] = useState({
        DayVisited: '',
        TimeVisited: '',
        Comment: ''
    });

    const { userid } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/customer/addfeedback/${userid}`, feedbackData);
            alert("Feedback Added Successfully!");
            // Optionally, redirect the user to another page after successful feedback submission
        } catch (error) {
            console.error("Error adding feedback:", error);
            alert("Failed to add feedback. Please try again.");
        }
    };

    return (
        <div className="FeedbackcreateFormContainer">
              <div className="formBootstrap">
              <h2 className="mb-4">Create Form</h2>

            
            <form onSubmit={handleSubmit}>
            <div class="form-group">
                    <label htmlFor="DayVisited">Day Visited</label>
                    <input type="date" className="form-control" id="DayVisited" name="DayVisited" value={feedbackData.DayVisited} onChange={handleInputChange} />
                </div>
                <div class="form-group">
                    <label htmlFor="TimeVisited">Time Visited</label>
                    <input type="time" className="form-control" id="TimeVisited" name="TimeVisited" value={feedbackData.TimeVisited} onChange={handleInputChange} />
                </div>
                <div class="form-group">
                    <label htmlFor="Comment">Comment</label>
                    <textarea id="Comment" className="form-control" name="Comment" value={feedbackData.Comment} onChange={handleInputChange}></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Submit Feedback</button>
            </form>
        </div>
        </div>
    );
};

export default AddFeedback;