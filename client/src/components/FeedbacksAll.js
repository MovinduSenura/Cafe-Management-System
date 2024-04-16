// import axios from "axios";
// import React,{ useState , useEffect} from "react";
// import { Link } from "react-router-dom";

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const FeedbacksAll = () =>{
//     const [FeedbacksAll, setFeedbacksAll ]= useState([]);
//     const [FeedbacksAllOriginal, setFeedbacksAllOriginal]= useState([]);
//     const [name, setName] = useState('');

//     useEffect(()=>{
//         const getFeedbacksAll = async()=>{
//             try{
//                 await axios.get('http://localhost:8000/feedback/feedbacks')
//                 .then((res)=>{
//                     setFeedbacksAll(res.data.AllFeedbacks);
//                     setFeedbacksAllOriginal(res.data.AllFeedbacks);
//                     console.log(res.data.message);
//                     console.log('status:' +res.data.status);
//                 })
//                 .catch((err)=>{
//                     console.log("☠️:: Error on API URL! ERROR:", err.message);
//                 })
//             }catch(err){
//                 console.log("☠️::Error on API URL! ERROR:",err.message);
//             }
//         }

//     getFeedbacksAll();
//     },[])

//     const handleDelete = async (id) =>{
//       try{

//         const confirmed = window.confirm('Are you sure you want to delete the feedback?');

//         if(confirmed){
//           await axios.delete(`http://localhost:8000/feedback/feedbackDelete/${id}`)
//           .then((res)=>{
//             alert(res.data.message);
//             console.log(res.data.message);
//           })
//           .catch((err)=>{
//             console.log('☠️ :: Error on API URL:' +err.message);
//           })
//         }else {
//           toast.warning('Deletion cancelled!');
//           console.log('Deletion cancelled');
//         }
//       }catch(err){
//         console.log('☠️ :: handleDelete function failed! ERROR: '+err.message);
//       }
//     }
//     const SearchFunction = async (searchTerm) => {
      

//       try{
//           await axios.get('http://localhost:8000/feedback/feedbackSearch', {
//           params: {
//               Name: searchTerm
//           }})
//           .then((res) => {
//               if(res.data.searchedFeedback.length === 0){
//                   setFeedbacksAll(res.data.searchedFeedback);
//               }
//               else{
//                   setFeedbacksAll(res.data.searchedFeedback);
//                   console.log(res.data.message);
//               }
//           })
//           .catch((error) => {
//               console.log("☠️ :: Error on response from server! ERROR : ", error.message);
              
//           })

//       }catch(err){
//           console.log("☠️ :: Error on axios API Request! ERROR : ", err.message);
          
//       }
//   }


//   const handleSearchChange = async (e) => {
//       const searchTerm = e.target.value;
//       setName(searchTerm);

//       if (searchTerm === '') { 
//         setFeedbacksAll(FeedbacksAllOriginal); 
          
//       } else {
//           await SearchFunction(searchTerm);
//       }
//   };

//   const handleFormSubmit = (e) => {
//       e.preventDefault();
//       SearchFunction(name);
//   };
//     return(
//         <div className="feedbacksallcontainer">
//           <div className="tableContainer">
//           <div className="tableHead">
                    

//                     <div className="search-container">
//                         <form className="searchTable" onSubmit={handleFormSubmit}>
//                             <input id="searchBar" type="text" value={name} onChange={handleSearchChange} placeholder="Search.." name="search"/>
//                             <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button> 
//                         </form>
//                     </div>
//                 </div>

//         <ToastContainer/>

//         <table class="table">
//   <thead>
//     <tr>
//       <th scope="col">No</th>
//       <th scope="col">FeedbackID</th>
//       <th scope="col">Name</th>
//       <th scope="col">Email</th>
//       <th scope="col">Day Visited</th>
//       <th scope="col">Time Visited</th>
//       <th scope="col">Comment</th>
//       <th scope="col"></th>
//     </tr>
//   </thead>
//   <tbody>
    
//     {FeedbacksAll && FeedbacksAll.map((feedback)=>(
//         <tr>
//         <th scope="row">1</th>
//         <td>{feedback._id}</td>
//         <td>{feedback.Name}</td>
//         <td>{feedback.Email}</td>
//         <td>{feedback.DayVisited}</td>
//         <td>{feedback.TimeVisited}</td>
//         <td>{feedback.Comment}</td>
        
//       </tr>
//     ))}
   
    

//   </tbody>
// </table>
// </div>
// </div>
//     )
// };
// export default FeedbacksAll;