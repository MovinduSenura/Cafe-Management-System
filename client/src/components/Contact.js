import React from 'react'
import Mail from '../images/mail.png'
import Phone from '../images/phone.png'
import Feedback from '../images/feedback.png'
import './Contact.css'

const Contact = () => {
  return (
    <div className="thirdSectorHome">
        <div className="thirdSecOverlay">
            <div className="thirdSectorAlignDiv">
                <div className="widthContiner">
                    <div className="ContactTextContainer">
                        <h1>Contact</h1>
                    </div>
                    <div className="ContactContent">
                        <div className="contactCard">
                            <img src={Mail} alt="Mail" />
                            <h5>Email Us</h5>
                            <p>cafeespressoelegance@gmail.com</p>
                        </div>
                        <div className="contactCard">
                            <img src={Phone} alt="Phone" />
                            <h5>Call Us</h5>
                            <p>+94 77 7314 087</p>
                        </div>
                        <div className="contactCard">
                            <img src={Feedback} alt="Feedback" />
                            <h5>Provide Feedback</h5>
                            <a href='/login2'><p>Click Here to Login</p></a>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </div>
  )
}

export default Contact