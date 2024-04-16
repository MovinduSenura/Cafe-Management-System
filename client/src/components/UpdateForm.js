// import React,{useEffect, useState} from "react";
// import axios from 'axios';
// import {useParams,useNavigate } from "react-router-dom";

// //import CSS file
// import './FeedbackCreateForm.css'


// const UpdateForm = () => {

//     const [Name, setName] = useState('');
//     const [Email, setEmail] = useState('');
//     const [DayVisited, setDayVisited] = useState('');
//     const [TimeVisited, setTimeVisited] = useState('');
//     const [Comment, setComment] = useState('');

//     const{id} = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const getOneFeedback = async() => {
//             try{
//                 await axios.get(`http://localhost:8000/feedback/feedback/${id}`)
//                 .then((res)=>{
//                     setName(res.data.Feedback.Name);
//                     setEmail(res.data.Feedback.Email);
//                     setDayVisited(res.data.Feedback.DayVisited);
//                     setTimeVisited(res.data.Feedback.TimeVisited);
//                     setComment(res.data.Feedback.Comment);
//                     console.log("✨ Item fetched successfully!");
//                 })
//                 .catch((err) => {
//                     console.log("☠️ :: Error on API URL :" +err.message);
//                 })

//             }catch (err){
//                 console.log("☠️ :: getOneFeedback Function failed! ERROR:" + err.message);
//             }
//         }
//         getOneFeedback();
//     }, [id])
    
//     const updateData = async (e) =>{
//         e.preventDefault();
//         try{
//             let updateFeedbackData={
//             Name:Name,
//             Email:Email,
//             DayVisited:DayVisited,
//             TimeVisited:TimeVisited,
//             Comment: Comment,
//             }
//             axios.patch(`http://localhost:8000/feedback/feedbackUpdate/${id}`, updateFeedbackData)
//             .then((res) => {
//                 alert(res.data.message);
//                 console.log(res.data.status);
//                 console.log(res.data.message);
//                 navigate('/allfeedbacks');
//             })
//             .catch ((err) => {
//                 console.log("💀 ::Error on API URL or updateItemData object:" +err.message);
//             })
//         }catch (err){
//             console.log("☠️ :: sendData funnction failed! ERROR:" +err.message);
//         }
// }

//     return (
//         <div className="FeedbackcreateFormContainer">
//         <div className="formBootstrap">
//             <h2 className="mb-4">Update Form</h2>
//             <form onSubmit={updateData}>
//                <div class="form-group">
//               <label for="Name">Name</label>
//               <input type="name" 
//               className="form-control" 
//               id="Name"
//               placeholder="Name" 
//               value={Name}
//               onChange={(e)=>setName(e.target.value)}
//               required
//               />
//          </div>
//     <div class="form-group">
//               <label for="Email1">Email address</label>
//               <input type="email" 
//               className="form-control" 
//               id="Email"  
//               placeholder="Email"
//               value={Email}
//               onChange={(e)=>setEmail(e.target.value)}
//               required
//               />
//          </div>
//         <div class="form-group">
//              <label for="DayVisited">Day Visited</label>
//              <input type="date" 
//              className="form-control"
//               id="DayVisited" 
//               placeholder="DayVisited"
//               value={DayVisited}
//               onChange={(e)=>setDayVisited(e.target.value)}
//               required
//               />
//         </div>
//         <div class="form-group">
//         <label for="TimeVisited">Time Visited</label>
//              <input type="time" 
//              className="form-control" 
//              id="TimeVisited" 
//              placeholder="TimeVisited"
//              value={TimeVisited}
//              onChange={(e)=>setTimeVisited(e.target.value)}
//              required
//              />
//         </div>
//         <div class="form-group">
//         <label for="Comment">Comment</label>
//              <input type="TextArea" 
//              className="form-control"
//               id="Comment" 
//               placeholder="Enter comment"
//               value={Comment}
//               onChange={(e)=>setComment(e.target.value)}
//               required
//               />
//         </div>


        
//            <button type="submit" class="btn btn-primary">Submit</button>
//         </form>
//         </div>
        
// </div>
  
//     )
// };
// export default UpdateForm;