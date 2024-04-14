import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'


import MenuCreateForm from './components/MenuCreateForm';
import MenuAllItems from './components/MenuAllItems';
import MenuAllItems2 from './components/MenuAllItems2';
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
import AllPromotions2 from './components/AllPromotions2';
import UpdatePromotionForm from './components/UpdatePromotionForm';

import PaymentCreateForm from './components/PaymentCreateForm';
import PaymentAll from './components/PaymentAll';
import PaymentUpdateForm from './components/PaymentUpdateForm';

import StaffCreateForm from './components/StaffCreateForm';
import AllStaff from './components/AllStaff';
import StaffLogin from './components/StaffLogin';
import Admin from './pages/admindash';
import Chef from './pages/cheffdash';
import Cashier from './pages/cashierdash';
import StaffUpdateForm from './components/StaffUpdateForm';

import StockCreateForm from './components/StockCreateForm';
import StockUpdateForm from './components/StockUpdateForm';
import StockUpdateForm2 from './components/StockUpdateForm2';
import AllItems from './components/AllItems';
import AllItems2 from './components/AllItems2';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SideNavPanel from './components/SideNavPanel';
import SideNavPanel2 from './components/SideNavPanel2';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

function AppContent() {

  const location = useLocation();

    // Array of routes where the navbar should be shown
    const showSideNavBarRoutes = ['/menucreateform', '/', '/menuupdateform/:id'];
    const showSideNavBar2Routes = ['/cashiermenu'];

    // Function to determine whether to render the navbar
    const renderSideNavBar = () => {
      return showSideNavBarRoutes.includes(location.pathname);
    };

    const renderSideNavBar2 = () => {
      return showSideNavBar2Routes.includes(location.pathname);
    };

  return (
    <div className="App">

      <NavBar />

      <div className='pagegridcontainer'>

        <div className='sidenavpanelsdiv'>
          {renderSideNavBar() && <SideNavPanel />}
          {renderSideNavBar2() && <SideNavPanel2 />}
        </div>
    
        <div className='pages'>

          <Routes>

            <Route path='/menucreateform' element={<MenuCreateForm />} />
            <Route path='/' element={<MenuAllItems />} />     
            <Route path='/menuupdateform/:id' element={<MenuUpdateForm />} />

            <Route path='/cashiermenu' element={<MenuAllItems2 />} />
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
            <Route path='/allpromotion2' element={<AllPromotions2/>}/>

            <Route path='/create' element={<PaymentCreateForm/>}/>
            <Route path='/getAllPayment' element={<PaymentAll/>}/>
            <Route path='/update/:id' element={<PaymentUpdateForm/>}/>

            <Route path = '/createStaff' element = {<StaffCreateForm/>}/>
            <Route path='/allstaff' element={<AllStaff/>}/>
            <Route path='/StaffLogin' element={<StaffLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cheff" element={< Chef/>} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path='/staffUpdateform/:id' element={<StaffUpdateForm/>}/>

            <Route path ='/stockcreateform' element = {<StockCreateForm />} />
            <Route path ='/stockupdateform/:id' element = {<StockUpdateForm />} />
            <Route path ='/stockupdateform2/:id' element = {<StockUpdateForm2 />} />
            <Route path = '/items' element = {<AllItems/>}/>
            <Route path = '/items2' element = {<AllItems2/>}/>

        

          </Routes>

        </div>

      </div>

        <Footer />

    </div>
  );
}

export default App;
