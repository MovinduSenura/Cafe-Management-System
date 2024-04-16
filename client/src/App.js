import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter and Routes
import { useLocation } from 'react-router-dom'; // Import useLocation

import FeedbackCreateForm from './components/FeedbackCreateForm';
import FeedbacksAll from './components/FeedbacksAll';
import UpdateForm from './components/UpdateForm';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import MenuPage from './pages/MenuPage';
import PromotionPage from './pages/PromotionPage';

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
          <Route exact path="/login" element={<CustomerLogin />} />
        </Routes>
      </div>
      {location.pathname !== '/login' && <Footer />} 
    </>
  );
}

export default App;
