import React from 'react'
// import React, { useState } from 'react'

const SideNavPanel = () => {
  // const [selectedOption,setSelectedOption] = useState(null)

  // const handleOptionClick = (option) => {
  //     setSelectedOption(option)
  // }

  return (
    <div class="sidenavpanel">
        <h4>Manager Dashboard</h4>
  
        
          {/* <a href="/">
            <div className="accessbox" onClick={() => handleOptionClick('option 1')} style={{backgroundColor: selectedOption === 'option 1' ? '#AB845B' : '#161616'}}>
              <p>Menu Management</p>
            </div>
          </a> */}
        
        
        {/* <div className="ccc" onClick={() => handleOptionClick('option 2')} style={{backgroundColor: selectedOption === 'option 2' ? '#AB845B' : '#161616'}}>
          <a href="#">Payment Management</a>
        </div>

        <div className="ccc" onClick={() => handleOptionClick('option 3')} style={{backgroundColor: selectedOption === 'option 3' ? '#AB845B' : '#161616'}}>
          <a href="#">Customer Management</a>
        </div>

        <div className="ccc" onClick={() => handleOptionClick('option 4')} style={{backgroundColor: selectedOption === 'option 4' ? '#AB845B' : '#161616'}}>
          <a href="/allpromotion">Promotion Management</a>
        </div> */}
        <a href="/allmenuitems">Menu Management</a>
        <a href="getAllPayment">Payment Management</a>
        <a href="/customersall2">Customer Management</a>
        <a href="/allpromotion">Promotion Management</a>
        <a href="/allfeedback">Feedback Management</a>
        <a href="/items">Stock Management</a>
        <a href="/allstaff">Staff Management</a>
        <a href='/getAllProfit'>Profit Management</a>
        {/* <a href="/">Order Management</a> */}
    </div>
  )
}

export default SideNavPanel