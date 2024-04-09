import React from 'react'
import LandingView from '../components/LandingView'
import About from '../components/About'
import Contact from '../components/Contact'
import './Home.css'

const Home = () => {
  return (
    <div className='homeContainer'>

      {/* Landing Sector */}
      <div id='landingview' className='sector1'>
        <LandingView/>
      </div>

      {/* About Sector */}
      <div id='about' className='sector2'>
        <About/>
      </div>

      {/* Contact */}
      <div id='contact' className='sector3'>
        <Contact/>
      </div>

    </div>
  )
}

export default Home