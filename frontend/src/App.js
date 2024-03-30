import {BrowserRouter,Routes, Route} from 'react-router-dom'

import PromotionCreateForm from './components/PromotionCreateForm';
import AllPromotions from './components/AllPromotions';
import UpdatePromotionForm from './components/UpdatePromotionForm';


function App() {
  return (
    <div className="App">

     <BrowserRouter>
         
         <Routes>

          <Route path='/createform' element={<PromotionCreateForm />}/>
          <Route path='/updateform/:id' element={<UpdatePromotionForm/>}/>
          <Route path='/' element={<AllPromotions/>}/>

         </Routes>
     
     </BrowserRouter>
     
    </div>
  );
}

export default App;
