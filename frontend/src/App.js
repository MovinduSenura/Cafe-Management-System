import {BrowserRouter, Routes, Route} from 'react-router-dom'

import PaymentCreateForm from './components/PaymentCreateForm';
import PaymentAll from './components/PaymentAll';
import PaymentUpdateForm from './components/PaymentUpdateForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>

          <Route path='/create' element={<PaymentCreateForm/>}/>
          <Route path='/' element={<PaymentAll/>}/>
          <Route path='/update/:id' element={<PaymentUpdateForm/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
                                      