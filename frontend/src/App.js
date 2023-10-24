import { Routes , Route} from 'react-router-dom';
import Form from './Form';
import Page from './Page';
import './App.scss'

function App() {
  
  
  

  return (
    <>
   
  <Routes>
  <Route path='*' element={<Form/>}/>
  <Route path="/page" element={<Page/>} />
 </Routes>
   
  </>
    
  );
}

export default App;