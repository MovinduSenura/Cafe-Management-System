import {BrowserRouter,Routes,Route} from 'react-router-dom'

import CreateOrderForm from './components/CreateOrderForm';
import OrdersAll from './components/OrdersAll';
import OrderUpdateForm from './components/OrderUpdateForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

      <Routes>

        <Route path='/CreateOrder' element={<CreateOrderForm />}/>
        <Route path='/' element={<OrdersAll/>}/>
        <Route path='/OrderUpdate/:id' element = {<OrderUpdateForm/>} />

      </Routes>

      <Footer/>

      </BrowserRouter>
  
    </div>
  );
}

export default App;
