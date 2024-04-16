// import React, { useEffect, useState } from 'react'

// import { Navigate, useParams } from 'react-router-dom';

// import axios from 'axios';

// function Feedbacks() {

//   const [userData, setUserData] = useState({
//     DayVisited: '',
//     TimeVisited: '',
//     Comment: '',
//   });

//   const { customerNIC,feedbackId } = useParams();

//   useEffect(() => {
//     fetchData(customerNIC,feedbackId);
//   }, [customerNIC,feedbackId]);

//   const fetchData = async (customerNIC,feedbackId) => {
//     try {
//       const response = await axios.get(`http://localhost:8070/user/feedback/${customerNIC}/${feedbackId}`);
//       setUserData(response.data.user);
//       console.log("Fetched User Data ! :", response.data.user);
//     } catch (error) {
//       console.log(error);
//     }
//   }


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log("Input changed - Name:", name, "Value:", value);
//     setUserData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }))
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.put(`http://localhost:8070/user/feedback/${customerNIC}/${feedbackId}`, userData);
//       alert("User Data Updated!");
//       window.location.href = `/find`
//       return;
//     } catch (error) {
//       console.log(error);
//       alert("Failed To Update!")
//     }
//   };

//   return (
//     <div>
     
//       <div >
//         <div>

//           <form  onSubmit={handleSubmit}>

//             <div>
//               <label htmlFor="dayVisited" >dayVisited</label>
//               <input type="text" id="DayVisited" name="DayVisited" placeholder="&nbsp;&nbsp;DayVisited" value={userData.DayVisited} onChange={handleInputChange} />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="TimeVisited" >TimeVisited</label>
//               <input type="text" id="TimeVisited" name="TimeVisited" placeholder="&nbsp;&nbsp;TimeVisited" value={userData.TimeVisited} onChange={handleInputChange} />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="Comment" >Comment</label>
//               <input type="text" id="Comment" name="Comment" placeholder="&nbsp;&nbsp;Comment" value={userData.Comment} onChange={handleInputChange} />
//             </div>



//             <button type="submit">Next</button>

//           </form>
//         </div>
       
//       </div>
//     </div>
//   )
// }

// export default Feedbacks;


// import React, { useEffect, useState } from 'react';
// import { Navigate, useParams } from 'react-router-dom';
// import axios from 'axios';

// function Feedbacks() {
//   const [userData, setUserData] = useState(null);
//   const { customerNIC, feedbackId } = useParams();

//   useEffect(() => {
//     fetchData(customerNIC, feedbackId);
//   }, [customerNIC, feedbackId]);

//   const fetchData = async (customerNIC, feedbackId) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/customer/getonefeedback/${customerNIC}/${feedbackId}`);
//       console.log(response)
//       setUserData(response.data.feedbacks);
//       console.log("Fetched User Data:", response.data.feedbacks);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.put(`http://localhost:8000/customer/feedback/${customerNIC}/${feedbackId}`, userData);
//       alert("User Data Updated!");
//     } catch (error) {
//       console.error("Error updating user data:", error);
//       alert("Failed To Update!");
//     }
//   };

//   return (
//     <div>
//       {userData && (
//         <div>
//           <h2>Update Feedback</h2>
//           <form onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="DayVisited">Day Visited</label>
//               <input
//                 type="text"
//                 id="DayVisited"
//                 name="DayVisited"
//                 placeholder="Day Visited"
//                 value={userData.DayVisited}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="TimeVisited">Time Visited</label>
//               <input
//                 type="text"
//                 id="TimeVisited"
//                 name="TimeVisited"
//                 placeholder="Time Visited"
//                 value={userData.TimeVisited}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="Comment">Comment</label>
//               <input
//                 type="text"
//                 id="Comment"
//                 name="Comment"
//                 placeholder="Comment"
//                 value={userData.Comment}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <button type="submit">Submit</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Feedbacks;

import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './FeedbackCreateForm.css'

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    <div className="FeedbackcreateFormContainer">
    <div className="formBootstrap">
      <h2 className="mb-4">Update Feedback</h2>
      <form onSubmit={handleSubmit}>
      <div class="form-group">
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
        
        <div class="form-group">
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
        
        <div class="form-group">
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
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
    </div>
  );
}

export default Feedbacks;
