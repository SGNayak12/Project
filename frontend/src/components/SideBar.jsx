// src/components/Sidebar.js
import { useState } from 'react';
import { Link } from 'react-router-dom'; // React Router for navigation

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle Sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger Menu for Mobile */}
      <button
        className="lg:hidden absolute top-4 left-4 text-white p-2"
        onClick={toggleSidebar}
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar w-64 bg-gray-800 text-white min-h-screen p-4 transition-all ease-in-out duration-300 
          ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}
      >
        <div className="logo p-4 text-2xl font-bold text-center">
          <span>YouTube</span>
        </div>

        <nav className="navigation space-y-2">
          <Link to="/" className="sidebar-item flex items-center p-2 rounded-md hover:bg-gray-700">
            <i className="fas fa-home text-lg mr-3"></i>
            Home
          </Link>
          <Link to="/trending" className="sidebar-item flex items-center p-2 rounded-md hover:bg-gray-700">
            <i className="fas fa-fire text-lg mr-3"></i>
            Trending
          </Link>
          <Link to="/subscriptions" className="sidebar-item flex items-center p-2 rounded-md hover:bg-gray-700">
            <i className="fas fa-bell text-lg mr-3"></i>
            Subscriptions
          </Link>
          <Link to="/library" className="sidebar-item flex items-center p-2 rounded-md hover:bg-gray-700">
            <i className="fas fa-video text-lg mr-3"></i>
            Library
          </Link>
          <Link to="/history" className="sidebar-item flex items-center p-2 rounded-md hover:bg-gray-700">
            <i className="fas fa-history text-lg mr-3"></i>
            History
          </Link>
          <Link to="/watch-later" className="sidebar-item flex items-center p-2 rounded-md hover:bg-gray-700">
            <i className="fas fa-clock text-lg mr-3"></i>
            Watch Later
          </Link>
          <Link to="/liked-videos" className="sidebar-item flex items-center p-2 rounded-md hover:bg-gray-700">
            <i className="fas fa-thumbs-up text-lg mr-3"></i>
            Liked Videos
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
