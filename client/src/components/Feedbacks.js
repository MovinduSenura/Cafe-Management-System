import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AddFeedback.css';

function Feedbacks() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { customerNIC, feedbackId } = useParams();

  useEffect(() => {
    fetchData(customerNIC, feedbackId);
  }, [customerNIC, feedbackId]);

  const fetchData = async (customerNIC, feedbackId) => {
    try {
      const response = await axios.get(`http://localhost:8000/customer/getonefeedback/${customerNIC}/${feedbackId}`);
      console.log(response)
      setUserData(response.data.feedback);
      setLoading(false); // Set loading to false after data is fetched
      console.log("Fetched User Data:", response.data.feedback);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const Star = ({ selected = false, onClick }) => (
    <span className={selected ? 'star selected' : 'star'} onClick={onClick}>
      ★
    </span>
  );
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleRatingChange = (newRating) => {
    setUserData({ ...userData, rating: newRating });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/customer/feedback/${customerNIC}/${feedbackId}`, userData);
      alert("User Data Updated!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed To Update!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="createFormContainer2">
      <div className="formBootstrap2">
        <h2>Update Feedback</h2>

        <form onSubmit={handleSubmit}>
          <div class="form-group mb-3">
            <label htmlFor="DayVisited">Day Visited</label>
          <input
            type="date"
            className="form-control"
            id="DayVisited"
            name="DayVisited"
            placeholder="Day Visited"
            value={userData.DayVisited}
            onChange={handleInputChange}
          />
        </div>
        
        <div class="form-group mb-3">
          <label htmlFor="TimeVisited">Time Visited</label>
          <input
            type="time"
            className="form-control"
            id="TimeVisited"
            name="TimeVisited"
            placeholder="Time Visited"
            value={userData.TimeVisited}
            onChange={handleInputChange}
          />
        </div>
        
        <div class="form-group mb-3">
          <label htmlFor="Comment">Comment</label>
          <input
            type="text"
            className="form-control"
            id="Comment"
            name="Comment"
            placeholder="Comment"
            value={userData.Comment}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group mb-3">
  <label>Rating</label>
  <div>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        selected={star <= userData.rating}
        onClick={() => handleRatingChange(star)}
      />
    ))}
  </div>
</div>

        <div className="submitbtndiv2">
          <button type="submit" class="btn btn-primary submitbtn2">Submit</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Feedbacks;
