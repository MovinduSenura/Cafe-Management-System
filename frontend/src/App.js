import {BrowserRouter, Routes, Route} from 'react-router-dom'


import MenuCreateForm from './components/MenuCreateForm';
import MenuAllItems from './components/MenuAllItems';
import MenuUpdateForm from './components/MenuUpdateForm';
import CreateOrderForm from './components/CreateOrderForm';
import OrdersAll from './components/OrdersAll';
import OrderUpdateForm from './components/OrderUpdateForm';

import CustomerCreateForm from "./components/CustomerCreateForm";
import CustomerAll from "./components/CustomerAll";
import CustomerUpdateForm from './components/CustomerUpdateForm';
import CustomerOneManager from './components/CustomerOneManager'
import CustomerOneCashier from './components/CustomerOneCashier'


import PromotionCreateForm from './components/PromotionCreateForm';
import AllPromotions from './components/AllPromotions';
import UpdatePromotionForm from './components/UpdatePromotionForm';

import PaymentCreateForm from './components/PaymentCreateForm';
import PaymentAll from './components/PaymentAll';
import PaymentUpdateForm from './components/PaymentUpdateForm';


import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SideNavPanel from './components/SideNavPanel';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
    
        <NavBar />

        <SideNavPanel />

        <div className='pages'>

          <Routes>

            <Route path='/menucreateform' element={<MenuCreateForm />} />
            <Route path='/' element={<MenuAllItems />} />
            <Route path='/menuupdateform/:id' element={<MenuUpdateForm />} />
            <Route path='/CreateOrder' element={<CreateOrderForm />} />
            <Route path='/OrdersAll' element={<OrdersAll />} />
            <Route path='/OrderUpdate/:id' element={<OrderUpdateForm />} />

            <Route path='/customerCreate' element={<CustomerCreateForm />} />
            <Route path='/customersall' element={<CustomerAll />} />
            <Route path='/customerUpdate/:id' element={<CustomerUpdateForm />} />
            <Route path='/customerView/:id' element={<CustomerOneManager />} />
            <Route path='/customerView2/:id' element={<CustomerOneCashier />} />
             
            <Route path='/createform' element={<PromotionCreateForm />}/>
            <Route path='/updateform/:id' element={<UpdatePromotionForm/>}/>
            <Route path='/allpromotion' element={<AllPromotions/>}/>

            <Route path='/create' element={<PaymentCreateForm/>}/>
            <Route path='/getAllPayment' element={<PaymentAll/>}/>
            <Route path='/update/:id' element={<PaymentUpdateForm/>}/>
        
          </Routes>

        </div>

        <Footer />

      </BrowserRouter>

    </div>
  );
}

export default App;
