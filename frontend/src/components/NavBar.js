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
            <Link to='/'>
                <h2>ESSPRESSO ELEGANCE</h2>
            </Link>
            <nav>
              <div className='navbtncontainer'>
                <Link to="/menucreateform">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 1')}
                  style={{backgroundColor: selectedOption === 'option 1' ? '#AB845B' : '#161616'}}>
                    <p>Home</p>
                  </div>
                </Link>
                <Link to="/">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 2')}
                  style={{backgroundColor: selectedOption === 'option 2' ? '#AB845B' : '#161616'}}>
                    <p>About</p>
                  </div>
                </Link>
                <Link to="/">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 3')}
                  style={{backgroundColor: selectedOption === 'option 3' ? '#AB845B' : '#161616'}}>
                  <p>Menu</p>
                  </div>
                </Link>
                <Link to="/">
                  <div className='headerbtndiv' onClick={() => handleOptionClick('option 4')}
                  style={{backgroundColor: selectedOption === 'option 4' ? '#AB845B' : '#161616'}}>
                  <p>Promotions</p>
                  </div>
                </Link>
              </div>
            </nav>
        </div>
    </div>

  )
}

export default NavBar