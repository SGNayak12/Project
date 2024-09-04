import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-900 w-full p-4 flex justify-between items-center text-black">
      <div className="flex items-center">
        <button onClick={toggleMenu} className="md:hidden">
          <MenuIcon className="text-white" />
        </button>
        <h1 className="ml-4 text-2xl font-bold">MyApp</h1>
      </div>

      <div className="hidden md:flex items-center w-full max-w-md">
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full px-4 py-2 border-black rounded-l-md text-black" 
        />
        <button className="bg-gray-700 p-2 rounded-r-md">
          <SearchIcon className="text-white" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button>
          <NotificationsIcon className="text-white" />
        </button>
        <button>
          <AccountCircleIcon className="text-white" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 w-full flex items-center">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full px-4 py-2 rounded-l-md text-black" 
          />
          <button className="bg-gray-700 p-2 rounded-r-md">
            <SearchIcon className="text-white" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

