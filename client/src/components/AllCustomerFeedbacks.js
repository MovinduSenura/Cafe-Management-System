import React, { useEffect, useState } from 'react'
import axios from 'axios'
import menuicons from '../images/menuicons.png'
// import { Link } from 'react-router-dom';
import './AllCustomerFeedbacks.css'
 
function AllCustomerFeedbacks() {

    const [appointments, setAppointments] = useState([]);
    // const [name, setName] = useState('');
    // const [FeedbacksAllOriginal, setFeedbacksAllOriginal]= useState([]);
 
    useEffect(() => {
        async function getAppointments() {
            try {
                const response = await axios.get("http://localhost:8000/customer/feedbackall");
                setAppointments(response.data.feedbacks);
                // setFeedbacksAllOriginal(response.data.feedbacks);
                console.log(response.data.feedbacks)
            } catch (error) {
                alert(error.message);
            }
        }
 
        getAppointments();
    }, []);
    const Star = ({ selected = false }) => (
        <span style={{ color: selected ? 'gold' : 'grey' }}>★</span>
    );
    
    
  return (
    <div className="feedbackitemsmaindivII">

            <div className="SectorFeedbackII">
                <div className="SecOverlay3II">
                    <div className="SectorAlignDiv3II">
                        <div className='leftsideII'>
                            <div className="feedbackInfoContainerII">
                                <h1>All Feedbacks</h1>
                            </div>
                            <div className="feedbackIconsContainerII">
                                <img src={menuicons} alt="menuicons" />
                            </div>
                        </div>

                        <div className='rightsideII'>
                            
                                {appointments.map((appointment) => (
                                    <div className='commentcard' key={appointment._id}>
                                        <p className='commentsubcard'>{appointment.Comment}</p> 
                                        <p>
            Ratings:  
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={ star} selected={star <= appointment.rating} />
            ))}               
        
        </p>                  <br></br>
                            <p className='replycolor' style={{color:"brown" ,fontWeight: "500"}}>Reply - {appointment.reply} </p>
                                       
                                    </div>
                                ))}
                                
                        </div>    

                    </div>
                </div>    
            </div>

        </div>
    
  )
}

export default AllCustomerFeedbacks