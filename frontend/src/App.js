import {BrowserRouter, Routes, Route} from 'react-router-dom'

import PaymentCreateForm from './components/PaymentCreateForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>

          <Route path='/' element={<PaymentCreateForm/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
                                      