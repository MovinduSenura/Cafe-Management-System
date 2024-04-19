import React from 'react'
import { Link } from 'react-router-dom'

import './Page404.css'

function Page404() {
  return (
    <div className='pg404'>
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>Cannot Authozied!</p>
      <Link to={'/'}><button className="btn btn-secondary btn-lg BackToHome">Home</button></Link>
    </div>
  )
}

export default Page404
