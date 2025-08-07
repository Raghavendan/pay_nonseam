import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';
import StartTrans from './pages/StartTrans';
import Transaction from './pages/Transaction';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={< Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={< Main />} />
          <Route path="/startTrans" element={<StartTrans />} />
          <Route path="/transaction" element={<Transaction />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;