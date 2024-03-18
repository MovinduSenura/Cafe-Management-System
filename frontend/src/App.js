import {BrowserRouter, Routes, Route} from 'react-router-dom'

import MenuCreateForm from './components/MenuCreateForm';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Routes>

          <Route path = '/' element = {<MenuCreateForm />} />

        </Routes>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
