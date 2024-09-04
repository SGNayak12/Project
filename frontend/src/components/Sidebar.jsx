import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import 'remixicon/fonts/remixicon.css';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex-col  bg-white-900 h-screen transition-width duration-300 ${isCollapsed ? 'w-20' : 'w-60'}`}>
      <button 
        onClick={toggleSidebar} 
        className="text-black text-2xl p-3 m-[18px] bg-black-800 font-bold rounded-md focus:outline-none"
      >
        {isCollapsed ? <i class="ri-arrow-right-line"></i>: <i class="ri-arrow-left-line"></i>}
      </button>
      <ul className="mt-10 p-2">
        {/* <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
          <HomeIcon className="text-black" />
          {!isCollapsed && <span className="ml-4 text-black">Home</span>}
        </li> */}
        <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
          <SubscriptionsIcon className="text-black" />
          {!isCollapsed && <span className="ml-4 text-black">Subscriptions</span>}
        </li>
        <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
          <VideoLibraryIcon className="text-black" />
          {!isCollapsed && <span className="ml-4 text-black">Library</span>}
        </li>
        <li className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
          <LibraryBooksIcon className="text-black" />
          {!isCollapsed && <span className="ml-4 text-black">My videos</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
