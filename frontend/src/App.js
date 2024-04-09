import {BrowserRouter, Routes, Route} from 'react-router-dom'

import MenuCreateForm from './components/MenuCreateForm';
import MenuAllItems from './components/MenuAllItems';
import MenuUpdateForm from './components/MenuUpdateForm';
import CreateOrderForm from './components/CreateOrderForm';
import OrdersAll from './components/OrdersAll';
import OrderUpdateForm from './components/OrderUpdateForm';

import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

      <NavBar/>

      <div className='pages'>

        <Routes>

          <Route path = '/menucreateform' element = {<MenuCreateForm />} />
          <Route path = '/' element = {<MenuAllItems />} />
          <Route path = '/menuupdateform/:id' element = {<MenuUpdateForm />} />
          <Route path='/CreateOrder' element={<CreateOrderForm />}/>
          <Route path='/OrdersAll' element={<OrdersAll/>}/>
          <Route path='/OrderUpdate/:id' element = {<OrderUpdateForm/>} />
          
        </Routes>

      </div>

      <Footer/>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
