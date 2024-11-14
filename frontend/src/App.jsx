import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <h1 className="text-3xl text-center mt-8"></h1> */}
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/video/:videoId" element={<VideoPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
