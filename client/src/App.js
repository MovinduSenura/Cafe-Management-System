import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter and Routes
import { useLocation } from 'react-router-dom'; // Import useLocation

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import PromotionPage from './pages/PromotionPage';

import FeedbackCreateForm from './components/FeedbackCreateForm';
import FeedbacksAll from './components/FeedbacksAll';
import UpdateForm from './components/UpdateForm';

import Login from './components/Login';
import UserData from './components/UserData';
import AddFeedback from './components/AddFeedback';
import Feedbacks from './components/Feedbacks';
import AllCustomerFeedbacks from './components/AllCustomerFeedbacks';

function App() {
  return (
    <div className="App">
      <BrowserRouter> {/* Wrap the entire component tree with BrowserRouter */}
        <AppContent /> {/* Render the main content of the app */}
      </BrowserRouter>
    </div>
  );
}

function AppContent() {
  const location = useLocation(); // useLocation hook

  return (
    <>
      <NavBar />  
      <div className='pages'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menudisplay" element={<MenuPage />} />
          <Route path="/promotiondisplay" element={<PromotionPage />} />
          <Route path="/feedbackcreateform" element={<FeedbackCreateForm />} />
          <Route path="/feedbackupdateform/:id" element={<UpdateForm />} />
          <Route path="/allfeedbacks" element={<FeedbacksAll />} />

          <Route path = '/' element = {<Home />} />
          <Route path = '/menudisplay' element = {<MenuPage />} />
          <Route path = '/promotiondisplay' element = {<PromotionPage />} />

          {/* <Route path='/feedbackcreateform/:customerNIC' element={<FeedbackCreateForm />}/>  */}
          {/* <Route path='/feedbackupdateform/:id' element={<UpdateForm/>}/> */}
          {/* <Route path='/allfeedbacks' element={<FeedbacksAll/>}/> */}

          <Route path = '/login2' element = {<Login />} />
          <Route path="/profile/:customerNIC" element={<UserData />} />
          <Route path='/add/:userid' element={<AddFeedback/>} />
          <Route path="/feedback/:customerNIC/:feedbackId" element={<Feedbacks />} />
          <Route path="/allcustomerfeedbacks" element={<AllCustomerFeedbacks />} />

        </Routes>
      </div>
      {location.pathname !== '/login2' && <Footer />} 
    </>
  );
}

export default App;
