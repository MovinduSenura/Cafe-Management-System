import {BrowserRouter, Routes, Route} from 'react-router-dom'

import MenuCreateForm from './components/MenuCreateForm';
import MenuAllItems from './components/MenuAllItems';
import MenuUpdateForm from './components/MenuUpdateForm';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

      <NavBar/>

      <div className='pages'>

        <Routes>

          <Route path = '/menucreateform' element = {<MenuCreateForm />} />
          <Route path = '/menuallitems' element = {<MenuAllItems />} />
          <Route path = '/menuupdateform/:id' element = {<MenuUpdateForm />} />
          <Route path = '/' element = {<Home />} />

        </Routes>

      </div>

      <Footer/>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
