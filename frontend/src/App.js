import {BrowserRouter, Routes, Route} from 'react-router-dom'
import CustomerCreateForm from "./components/CustomerCreateForm";
import CustomerAll from "./components/CustomerAll";
import CustomerUpdateForm from './components/CustomerUpdateForm';
import CustomerOneManager from './components/CustomerOneManager'
import CustomerOneCashier from './components/CustomerOneCashier'

function App() {
  return (
    <div className="App">

      <BrowserRouter>
      <Routes>
      //function in the createform.js
      <Route path='/customerCreate'element ={<CustomerCreateForm/>}/>
      <Route path='/customersall' element={<CustomerAll/>}/>
      <Route path='/customerUpdate/:id' element ={<CustomerUpdateForm/>}/>
      <Route path='/customerView/:id' element ={<CustomerOneManager/>}/>
      <Route path='/customerView2/:id' element ={<CustomerOneCashier/>}/>

      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
