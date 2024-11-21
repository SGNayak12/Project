// src/pages/Home.js
import  { useEffect, useState } from 'react';
import axios from 'axios'; // Optional if you choose to use Axios

function Home() {
  const [videos, setVideos] = useState([]);
  const apiEndpoint = 'http://localhost:3000/api/v1/videos'; // Your API endpoint

  // Fetch videos from your backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch data using axios
        const response = await axios.get(apiEndpoint);
        console.log(response);
        setVideos(response.data.data); // Axios automatically parses the JSON response
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-8">Video Gallery</h1>
      <p className="mb-8">Explore our latest videos!</p> */}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.isArray(videos) && videos.map((video) => (
          <div key={video.id} className="border rounded-lg shadow-lg overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <p className="text-sm text-gray-500">{video.description}</p>
              <a
                href={video.videoUrl}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Video
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
