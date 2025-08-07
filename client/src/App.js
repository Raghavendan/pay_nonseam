import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';
// import StartTrans from './pages/StartTrans';
import Transaction from './pages/Transaction';
import Trans from './pages/NewTrans';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={< Login />} />
          <Route path="/main" element={< Main />} />
          {/* <Route path="/startTrans" element={<StartTrans />} /> */}
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/trans" element={<Trans />} />



        </Routes>
      </div>
    </Router>
  );
}

export default App;