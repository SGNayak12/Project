import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/videos/${videoId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setVideo(data);
        setLikes(data.likes); // Assuming the response contains like count
      })
      .catch((error) => console.error('Error fetching video:', error));
  }, [videoId]);

  const handleLike = () => {
    fetch('http://localhost:8000/api/v1/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ videoId }),
    })
      .then((res) => res.json())
      .then((data) => setLikes(data.likes)) // Update like count after liking
      .catch((error) => console.error('Error liking video:', error));
  };

  if (!video) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="video-player">
        <video controls src={video.url} className="w-full rounded-lg"></video>
        <h2 className="text-2xl mt-4">{video.title}</h2>
        <p className="text-gray-500">{video.description}</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleLike}
        >
          Like ({likes})
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
