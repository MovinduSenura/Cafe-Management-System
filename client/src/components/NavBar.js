import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [selectedOption,setSelectedOption] = useState(null)

  const handleOptionClick = (option) => {
      setSelectedOption(option)
  }

  return (

    <div className='header'>
        <div className="headercontainer">
            <a href='/'>
                <h2>ESPRESSO ELEGANCE</h2>
            </a>
            <nav>
              <div className='navbtncontainer'>
                <a href="/#landingview">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 1')}
                  style={{backgroundColor: selectedOption === 'option 1' ? '#AB845B' : '#161616'}}>
                    <p>Home</p>
                  </div>
                </a>
                <a href="/#about">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 2')}
                  style={{backgroundColor: selectedOption === 'option 2' ? '#AB845B' : '#161616'}}>
                    <p>About</p>
                  </div>
                </a>
                <Link to="/menudisplay">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 3')}
                  style={{backgroundColor: selectedOption === 'option 3' ? '#AB845B' : '#161616'}}>
                  <p>Menu</p>
                  </div>
                </Link>
                <Link to="/promotiondisplay">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 4')}
                  style={{backgroundColor: selectedOption === 'option 4' ? '#AB845B' : '#161616'}}>
                  <p>Promotions</p>
                  </div>
                </Link>
                <a href="/#contact">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 5')}
                  style={{backgroundColor: selectedOption === 'option 5' ? '#AB845B' : '#161616'}}>
                  <p>Contact</p>
                  </div>
                </a>
              </div>
            </nav>
        </div>
    </div>

  )
}

export default NavBar