import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MorningRise from './pages/landing_page';
import MainLayout from './pages/Operations/main_layout';
import SignUpModal from './modals/signUpModal';
import SignInModal from './modals/SignInModal';




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MorningRise/>} />
        <Route path="/signin" element={<SignInModal />} />
        <Route path="/signup" element={<SignUpModal />} />
        <Route path="/dashboard" element={<MainLayout/>} />
        
      </Routes>
    </Router>
  );
};

export default App;
