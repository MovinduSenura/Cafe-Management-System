import{BrowserRouter,Routes,Route } from 'react-router-dom'
import FeedbackCreateForm from './components/FeedbackCreateForm';
import FeedbacksAll from './components/FeedbacksAll';
import UpdateForm from './components/UpdateForm';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        
        <Route path='/createform' element={<FeedbackCreateForm />}/> 
        <Route path='/updateform/:id' element={<UpdateForm/>}/>
        <Route path='/' element={<FeedbacksAll/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
  }
export default App;
