import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/videos', {
      method: 'GET',
      // credentials: 'include', // To handle cookies/session data
    })
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error('Error fetching videos:', error));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Array.isArray(videos) && videos.map((video) => (
  <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-white text-xl">{video.title}</h3>
      <p className="text-gray-400">{video.description}</p>
      <Link to={`/video/${video.id}`} className="text-blue-500 hover:underline">Watch Now</Link>
    </div>
  </div>
))}
    </div>
  );
};

export default VideoList;
