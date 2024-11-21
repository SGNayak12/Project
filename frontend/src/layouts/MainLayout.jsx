// src/layouts/MainLayout.js
// import React from 'react';
import Sidebar from '../components/SideBar';  // Import Sidebar
import { Outlet } from 'react-router-dom'; // This is where content will be rendered

function MainLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
