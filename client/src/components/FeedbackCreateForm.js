// import React, { useState } from "react";
// import axios from 'axios';
// import { useParams } from 'react-router-dom';


// import './FeedbackCreateForm.css'

// const FeedbackCreateForm = () => {


//     const [feedbackData, setFeedbackData] = useState({
//         DayVisited: '',
//         TimeVisited: '',
//         Comment: ''
//     });

 
//     const { customerNIC } = useParams();
  
//     console.log(customerNIC)
   



//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFeedbackData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(`http://localhost:8000/customer/addfeedback/${customerNIC}`, feedbackData);
//             alert("Feedback Added Successfully!");
//             // Optionally, redirect the user to another page after successful feedback submission
//         } catch (error) {
//             console.error("Error adding feedback:", error);
//             alert("Failed to add feedback. Please try again.");
//         }
//     };

//     return (
  
//         <div>
//             <h2>Add Feedback</h2>
//             {customerNIC}
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="DayVisited">Day Visited</label>
//                     <input type="text" id="DayVisited" name="DayVisited" value={feedbackData.DayVisited} onChange={handleInputChange} />
//                 </div>
//                 <div>
//                     <label htmlFor="TimeVisited">Time Visited</label>
//                     <input type="text" id="TimeVisited" name="TimeVisited" value={feedbackData.TimeVisited} onChange={handleInputChange} />
//                 </div>
//                 <div>
//                     <label htmlFor="Comment">Comment</label>
//                     <textarea id="Comment" name="Comment" value={feedbackData.Comment} onChange={handleInputChange}></textarea>
//                 </div>
//                 <button type="submit">Submit Feedback</button>
//             </form>
//         </div>

//     )
// };
// export default FeedbackCreateForm;