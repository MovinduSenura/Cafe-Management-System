import React from 'react'
// import React, { useState } from 'react'

const SideNavPanel2 = () => {
  // const [selectedOption,setSelectedOption] = useState(null)

  // const handleOptionClick = (option) => {
  //     setSelectedOption(option)
  // }

  return (
    <div class="sidenavpanel">
        <h4>Cashier Dashboard</h4>
        
        <a href="/cashiermenu">Menu Management</a>
        <a href="getAllPayment2">Payment Management</a>
        <a href="/customersall">Customer Management</a>
        <a href="/allpromotion2">Promotion Management</a>
        <a href="/OrdersAll">Order Management</a>
    </div>
  )
}

export default SideNavPanel2