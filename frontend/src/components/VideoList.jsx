import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoList = () => {
  // State to store videos and loading/error states
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/videos");
        // console.log(typeof(response));
        // console.log(response);
        if (response.status!=200) {
          throw new Error("Failed to fetch videos");
        }
        // const data = await response.json();
        setVideos(response.data.data);
        // console.log(videos)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold my-4">All Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {
          console.log(videos)
        }
        {Array.isArray(videos) && videos.length > 0 ? (
        videos.map((video) => (
          <div key={video._id} className="border p-4 rounded-lg">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="mt-2 text-xl font-semibold">{video.title}</h3>
            <p className="text-sm text-gray-600">{video.description}</p>
            <a
              href={`vedio.vedioFile`}
              className="text-blue-500 mt-2 block"
            >
              Watch Video
            </a>
          </div>
        ))
      ) : (
        <p>No videos available</p>
      )}

      </div>
    </div>
  );
};

export default VideoList;
