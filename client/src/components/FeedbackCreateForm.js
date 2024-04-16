import React, { useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

//import CSS file
import './FeedbackCreateForm.css'

const FeedbackCreateForm = () => {

    // const [Name, setName] = useState('');
    // const [Email, setEmail] = useState('');
    // const [DayVisited, setDayVisited] = useState('');
    // const [TimeVisited, setTimeVisited] = useState('');
    // const [Comment, setComment] = useState('');


    // const sendData = async (e) =>{
    //     e.preventDefault();
    //     try{
    //         const newFeedbackData={
    //         Name:Name,
    //         Email:Email,
    //         DayVisited:DayVisited,
    //         TimeVisited:TimeVisited,
    //         Comment: Comment,
    //         };
    //         const response = await axios.post('http://localhost:8000/feedback/create',newFeedbackData);
    //         console.log(response.data);

    //         alert (response.data.message);

    //         setName('');
    //         setEmail('');
    //         setDayVisited('');
    //         setTimeVisited('');
    //         setComment('');
    //     } catch (error){
    //         console.error("💀 ::Error sending data:",error.message);
    //     }
    // };

    const [feedbackData, setFeedbackData] = useState({
        DayVisited: '',
        TimeVisited: '',
        Comment: ''
    });

    //const { userid } = useParams();
    const { customerNIC } = useParams();
    //const { CustomerNIC } = useParams();

    //console.log(userid)
    console.log(customerNIC)
    //console.log(CustomerNIC)



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
            await axios.post(`http://localhost:8000/customer/addfeedback/${customerNIC}`, feedbackData);
            alert("Feedback Added Successfully!");
            // Optionally, redirect the user to another page after successful feedback submission
        } catch (error) {
            console.error("Error adding feedback:", error);
            alert("Failed to add feedback. Please try again.");
        }
    };

    return (
        //         <div className="FeedbackcreateFormContainer">
        //         <div className="formBootstrap">
        //         <h2 className="mb-4">Create Form</h2>
        //             <form onSubmit={handleSubmit}>

        //         <div class="form-group">
        //              <label for="DayVisited">Day Visited</label>
        //              <input type="text" 
        //              className="form-control"
        //               name="DayVisited" 
        //               placeholder="DayVisited"
        //               value={feedbackData.DayVisited}
        //               onChange={handleInputChange}
        //               required
        //               />
        //         </div>
        //         <div class="form-group">
        //         <label for="TimeVisited">Time Visited</label>
        //              <input type="text" 
        //              className="form-control" 
        //              name="TimeVisited" 
        //              placeholder="TimeVisited"
        //              value={feedbackData.TimeVisited}
        //              onChange={handleInputChange}
        //              required
        //              />
        //         </div>
        //         <div class="form-group">
        //         <label for="Comment">Comment</label>
        //              <input type="TextArea" 
        //              className="form-control"
        //               name="Comment" 
        //               placeholder="Enter comment"
        //               value={feedbackData.Comment}
        //               onChange={handleInputChange}
        //               required
        //               />
        //         </div>




        //            <button type="submit" class="btn btn-primary">Submit</button>
        //         </form>
        //         </div>

        // </div>
        <div>
            <h2>Add Feedback</h2>
            {customerNIC}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="DayVisited">Day Visited</label>
                    <input type="text" id="DayVisited" name="DayVisited" value={feedbackData.DayVisited} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="TimeVisited">Time Visited</label>
                    <input type="text" id="TimeVisited" name="TimeVisited" value={feedbackData.TimeVisited} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="Comment">Comment</label>
                    <textarea id="Comment" name="Comment" value={feedbackData.Comment} onChange={handleInputChange}></textarea>
                </div>
                <button type="submit">Submit Feedback</button>
            </form>
        </div>

    )
};
export default FeedbackCreateForm;