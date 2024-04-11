import {BrowserRouter, Routes, Route} from 'react-router-dom'

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

      <NavBar/>

      <div className='pages'>

        <Routes>

          <Route path = '/' element = {<Home />} />
          <Route path = '/menudisplay' element = {<MenuPage />} />

        </Routes>

      </div>

      <Footer/>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
