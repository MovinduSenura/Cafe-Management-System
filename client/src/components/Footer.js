import React from 'react'
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import logo from '../images/logo.png';

const Footer = () => {
  return (
    // <div>
    //     <p>FOOTER</p>
    // </div>

    <footer style={{ backgroundColor: '#161616', color: '#ffffff', padding: '20px' }}>
        <div className='foot'>
            <div className='footerContent' style={{ display: 'flex' }}>
                <div className='footerImageContainer'>
                    <img src={logo} alt="Espresso Elegance Logo" />
                </div>
                
                <div className='footerBlocksContainer'>
                    <div className='block1'>
                        <h3>Open Hours</h3>
                        <p>Monday - Sunday</p>
                        <p>8am - 9pm</p>
                    </div>
                    <div className='block2'>
                        <h3>Address</h3>
                        <p>Cafe Espresso Elegance Pvt Ltd,</p>
                        <p>No 121/4, Marine Drive,</p>
                        <p>Colombo</p>
                    </div>
                    <div className='block3'>
                        <h3>Find Us</h3>
                        <div className='socialmediaicons' style={{ display: 'flex' }}>  
                            {/* Replace '#' with actual URLs */}
                            <a href="/" target="_blank" rel="noopener noreferrer"><FaFacebook size={27} /></a> 
                            {/* Add some space between icons */}
                            &nbsp; &nbsp; &nbsp;
                            {/* Replace '#' with actual URLs */}
                            <a href="/" target="_blank" rel="noopener noreferrer"><FaInstagram size={27} /></a> 
                            {/* Add some space between icons */}
                            &nbsp; &nbsp; &nbsp;
                            {/* Replace '#' with actual URLs */}
                            <a href="/" target="_blank" rel="noopener noreferrer"><FaTiktok size={27} /></a> 
                        </div>
                    </div>
                </div>
            </div>

            <div className='copyright'>
                <hr className='copyrighthr'></hr>
                {/* Copyright text */}
                <p>© Copyright 2024 ESPRESSO ELEGANCE. All Rights Reserved</p>
                <small>Designed by <w className='daedra'>DAEDRA</w></small>
            </div>
        </div>
      
    </footer>
  )
}

export default Footer