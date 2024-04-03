import {BrowserRouter, Routes, Route} from 'react-router-dom'

import PaymentCreateForm from './components/PaymentCreateForm';
import PaymentAll from './components/PaymentAll';
import PaymentUpdateForm from './components/PaymentUpdateForm';
// import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>

      {/* <NavBar/> */}
      <div className='pages'>
      <Routes>

          <Route path='/create' element={<PaymentCreateForm/>}/>
          <Route path='/' element={<PaymentAll/>}/>
          <Route path='/update/:id' element={<PaymentUpdateForm/>}/>

      </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
                                      