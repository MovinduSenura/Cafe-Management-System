import React from 'react'
import Logo from '../images/logo.png'
import './LandingView.css'

const LandingView = () => {
  return (
    <div className="firstSectorHome">
        <div className="firstSecOverlay">
            <div className="firstSectorAlignDiv">
                <div className="logoContainer">
                    <img src={Logo} alt="Espresso Elegance Logo" />
                </div>
                <div className="InfoContainer">
                    <h1>Elegance in Every Espresso</h1>
                    <p>Where Every Sip is a Symphony of Flavor</p>
                    <button className="exploreBtn">Explore</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LandingView