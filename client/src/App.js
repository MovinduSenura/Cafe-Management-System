import {BrowserRouter, Routes, Route} from 'react-router-dom'

import FeedbackCreateForm from './components/FeedbackCreateForm';
import FeedbacksAll from './components/FeedbacksAll';
import UpdateForm from './components/UpdateForm';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import Login from './components/Login';
import UserData from './components/UserData';
import AddFeedback from './components/AddFeedback';
import Feedbacks from './components/Feedbacks';
import AllFeedbacks from './components/AllFeedbacks';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

      <NavBar/>

      <div className='pages'>

        <Routes>

          <Route path = '/' element = {<Home />} />
          <Route path = '/menudisplay' element = {<MenuPage />} />

          <Route path='/feedbackcreateform/:customerNIC' element={<FeedbackCreateForm />}/> 
          <Route path='/feedbackupdateform/:id' element={<UpdateForm/>}/>
          <Route path='/allfeedbacks' element={<FeedbacksAll/>}/>
          <Route path = '/login' element = {<Login />} />
          <Route path="/profile/:customerNIC" element={<UserData />} />
          <Route path='/add/:userid' element={<AddFeedback/>} />
          <Route path="/feedback/:customerNIC/:feedbackId" element={<Feedbacks />} />
          <Route path='/allfeedback' element={<AllFeedbacks/>} />

        </Routes>

      </div>

      <Footer/>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
