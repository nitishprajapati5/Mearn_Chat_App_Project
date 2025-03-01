import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
