import {BrowserRouter, Routes, Route} from 'react-router-dom'

import MenuCreateForm from './components/MenuCreateForm';
import MenuAllItems from './components/MenuAllItems';
import MenuUpdateForm from './components/MenuUpdateForm';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>

          <Route path = '/menucreateform' element = {<MenuCreateForm />} />
          <Route path = '/' element = {<MenuAllItems />} />
          <Route path = '/menuupdateform/:id' element = {<MenuUpdateForm />} />

        </Routes>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
