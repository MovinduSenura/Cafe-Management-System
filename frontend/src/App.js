import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'


import MenuCreateForm from './components/MenuCreateForm';
import MenuAllItems from './components/MenuAllItems';
import MenuAllItems2 from './components/MenuAllItems2';
import MenuUpdateForm from './components/MenuUpdateForm';

import OrderCreate from './components/OrderCreate';
import OrdersAll from './components/OrdersAll';
import OrderUpdateForm from './components/OrderUpdateForm';

import CustomerCreateForm from "./components/CustomerCreateForm";
import CustomerAll from "./components/CustomerAll";
import CustomerAll2 from "./components/CustomerAll2";
import CustomerUpdateForm from './components/CustomerUpdateForm';
import CustomerOneManager from './components/CustomerOneManager'
import CustomerOneCashier from './components/CustomerOneCashier'

import PromotionCreateForm from './components/PromotionCreateForm';
import AllPromotions from './components/AllPromotions';
import AllPromotions2 from './components/AllPromotions2';
import UpdatePromotionForm from './components/UpdatePromotionForm';

import PaymentCreateForm from './components/PaymentCreateForm';
import PaymentAll from './components/PaymentAll';
import PaymentAll2 from './components/PaymentAll2';
import PaymentUpdateForm from './components/PaymentUpdateForm';

import StaffCreateForm from './components/StaffCreateForm';
import AllStaff from './components/AllStaff';
import StaffLogin from './components/StaffLogin';
import StaffUpdateForm from './components/StaffUpdateForm';

import StockCreateForm from './components/StockCreateForm';
import StockUpdateForm from './components/StockUpdateForm';
import StockUpdateForm2 from './components/StockUpdateForm2';
import AllItems from './components/AllItems';
import AllItems2 from './components/AllItems2';

import AllFeedbacks from './components/AllFeedbacks';
import FeedbackReply from './components/FeedbackReply';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SideNavPanel from './components/SideNavPanel';
import SideNavPanel2 from './components/SideNavPanel2';

import Page404 from './components/Page404';
import ProfitCreateForm from './components/ProfitCreateForm';
import ProfitAll from './components/ProfitAll';
import ProfitUpdateForm from './components/ProfitUpdateForm';
import Book from './components/Book';

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
    const showSideNavBarRoutes = ['/menucreateform', '/allmenuitems', '/customersall2', '/customerView/:id', '/menuupdateform/:id', '/stockcreateform', '/stockupdateform/:id', '/items', '/createform', '/updateform/:id', '/allpromotion', '/createStaff', '/allstaff', '/staffUpdateform/:id', '/allfeedback', '/getAllPayment', '/getAllProfit', '/createProfit'];
    const showSideNavBar2Routes = ['/cashiermenu', '/customerCreate', '/customersall', '/customerUpdate/:id', '/customerView2/:id', '/ordercreate', '/OrdersAll', '/OrderUpdate/:id', '/allpromotion2', '/getAllPayment2'];

    // Function to determine whether to render the navbar
    const renderSideNavBar = () => {
      return showSideNavBarRoutes.includes(location.pathname);
    };

    const renderSideNavBar2 = () => {
      return showSideNavBar2Routes.includes(location.pathname);
    };

  return (
    <>
    <div className="App">

      <NavBar />

      <div className='pagegridcontainer'>

        <div className='sidenavpanelsdiv'>
          {renderSideNavBar() && <SideNavPanel />}
          {renderSideNavBar2() && <SideNavPanel2 />}
        </div>

        <Routes>
          <Route path='/' element={<StaffLogin />} />
        </Routes>
    
        <div className='pages'>

          <Routes>

            {/* Menu */}
            <Route path='/menucreateform' element={<MenuCreateForm />} />
            <Route path='/allmenuitems' element={<MenuAllItems />} />     
            <Route path='/menuupdateform/:id' element={<MenuUpdateForm />} />
            <Route path='/cashiermenu' element={<MenuAllItems2 />} />

            {/* Payment */}
            <Route path='/payment/create/:id' element={<PaymentCreateForm/>}/>
            <Route path='/getAllPayment' element={<PaymentAll/>}/>
            <Route path='/getAllPayment2' element={<PaymentAll2/>}/>
            <Route path='/update/:id' element={<PaymentUpdateForm/>}/>

            {/* Customer */}
            <Route path='/customerCreate' element={<CustomerCreateForm />} />
            <Route path='/customersall' element={<CustomerAll />} />
            <Route path='/customersall2' element={<CustomerAll2 />} />
            <Route path='/customerUpdate/:id' element={<CustomerUpdateForm />} />
            <Route path='/customerView/:id' element={<CustomerOneManager />} />
            <Route path='/customerView2/:id' element={<CustomerOneCashier />} />

            {/* Promotion   */}
            <Route path='/createform' element={<PromotionCreateForm />}/>
            <Route path='/updateform/:id' element={<UpdatePromotionForm/>}/>
            <Route path='/allpromotion' element={<AllPromotions/>}/>
            <Route path='/allpromotion2' element={<AllPromotions2/>}/>

            {/* Feedback */}
            <Route path='/allfeedback' element={<AllFeedbacks/>} />
            <Route path="/feedback-reply/:feedbackId" element={<FeedbackReply />} />


            {/* Stock */}
            <Route path='/stockcreateform' element = {<StockCreateForm />} />
            <Route path='/stockupdateform/:id' element = {<StockUpdateForm />} />
            <Route path='/stockupdateform2/:id' element = {<StockUpdateForm2 />} />
            <Route path='/items' element = {<AllItems/>}/>
            <Route path='/items2' element = {<AllItems2/>}/>
           
            {/* Staff */}
            <Route path='/createStaff' element = {<StaffCreateForm/>}/>
            <Route path='/allstaff' element={<AllStaff/>}/>
            <Route path='/staffUpdateform/:id' element={<StaffUpdateForm/>}/>
           
            {/* Order */}
            <Route path="/ordercreate" element={<OrderCreate/>} />
            <Route path='/OrdersAll' element={<OrdersAll />} />
            <Route path='/OrderUpdate/:id' element={<OrderUpdateForm />} />

            {/* Profit */}
            <Route path='/createProfit' element={<ProfitCreateForm/>}/>
            <Route path='/getAllProfit' element={<ProfitAll/>}/>
            <Route path='/updateProfit/:id' element={<ProfitUpdateForm/>}/>

            {/* Reservation */}
            <Route path='/reservation' element={<Book />} />
            
            <Route path='/404' element={<Page404 />} />

          </Routes>

        </div>

      </div>

        {/* <Footer /> */}

    </div>
    {location.pathname !== '/' && <Footer />}
    </>
  );
}

export default App;
