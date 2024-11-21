// src/App.js
// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/SideBar';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import Upload from './pages/Upload';
// import SignIn from './pages/SignIn';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout with Sidebar */}
        <Route path="/" element={<MainLayout />}>
          {/* Define routes inside the main layout */}
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
