import React,{useState} from "react";
import axios from 'axios';

//import CSS file
import './FeedbackCreateForm.css'

const FeedbackCreateForm = () =>{

    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [DayVisited, setDayVisited] = useState('');
    const [TimeVisited, setTimeVisited] = useState('');
    const [Comment, setComment] = useState('');


    const sendData = async (e) =>{
        e.preventDefault();
        try{
            const newFeedbackData={
            Name:Name,
            Email:Email,
            DayVisited:DayVisited,
            TimeVisited:TimeVisited,
            Comment: Comment,
            };
            const response = await axios.post('http://localhost:8000/feedback/create',newFeedbackData);
            console.log(response.data);

            alert (response.data.message);

            setName('');
            setEmail('');
            setDayVisited('');
            setTimeVisited('');
            setComment('');
        } catch (error){
            console.error("💀 ::Error sending data:",error.message);
        }
    };

    return (
        <div className="FeedbackcreateFormContainer">
        <div className="formBootstrap">
        <h2 className="mb-4">Create Form</h2>
            <form onSubmit={sendData}>
               <div class="form-group">
              <label for="Name">Name</label>
              <input type="name" 
              className="form-control" 
              id="Name"
              placeholder="Name" 
              value={Name}
              onChange={(e)=>setName(e.target.value)}
              required
              />
         </div>
    <div class="form-group">
              <label for="Email1">Email address</label>
              <input type="email" 
              className="form-control" 
              id="Email"  
              placeholder="Email"
              value={Email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              />
         </div>
        <div class="form-group">
             <label for="DayVisited">Day Visited</label>
             <input type="date" 
             className="form-control"
              id="DayVisited" 
              placeholder="DayVisited"
              value={DayVisited}
              onChange={(e)=>setDayVisited(e.target.value)}
              required
              />
        </div>
        <div class="form-group">
        <label for="TimeVisited">Time Visited</label>
             <input type="time" 
             className="form-control" 
             id="TimeVisited" 
             placeholder="TimeVisited"
             value={TimeVisited}
             onChange={(e)=>setTimeVisited(e.target.value)}
             required
             />
        </div>
        <div class="form-group">
        <label for="Comment">Comment</label>
             <input type="TextArea" 
             className="form-control"
              id="Comment" 
              placeholder="Enter comment"
              value={Comment}
              onChange={(e)=>setComment(e.target.value)}
              required
              />
        </div>


        
           <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        </div>
        
</div>
  
    )
};
export default FeedbackCreateForm;