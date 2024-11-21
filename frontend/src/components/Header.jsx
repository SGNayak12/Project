// src/components/Header.js
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">VideoPlatform</Link>
        <nav>
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/upload" className="mr-4">Upload</Link>
          <Link to="/login">Sign In</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
