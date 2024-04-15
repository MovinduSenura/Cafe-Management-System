import {BrowserRouter, Routes, Route} from 'react-router-dom'

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

      <BrowserRouter>

      <NavBar/>

      <div className='pages'>

        <Routes>

          <Route path = '/' element = {<Home />} />
          <Route exact path="/login" element={<CustomerLogin/>} />
          <Route path = '/menudisplay' element = {<MenuPage />} />
          <Route path = '/promotiondisplay' element = {<PromotionPage />} />

          <Route path='/feedbackcreateform' element={<FeedbackCreateForm />}/> 
          <Route path='/feedbackupdateform/:id' element={<UpdateForm/>}/>
          <Route path='/allfeedbacks' element={<FeedbacksAll/>}/>
        </Routes>

      </div>

      <Footer/>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
