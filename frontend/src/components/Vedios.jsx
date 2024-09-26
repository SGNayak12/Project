import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

function Vedios() {
    const [videos, setVideos] = useState([]);
    const [vedioLink,setVedioLink]=useState('');

  async function fetchVideos() {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/videos/");
      console.log(response.data.data);
      setVideos(response.data.data); 
    } catch (error) {
      console.log("Error fetching videos", error);
    }
  }

  useEffect(() => {
    fetchVideos(); 
  }, []);
  return (
    <div className='flex flex-row mt-5 mr-40 w-full'>
  {
    Array.isArray(videos) && videos.length > 0 ? (
      videos.map((vedio) => {
        return (
          <div key={vedio._id} className="h-72 mb-5 w-52 rounded-lg overflow-hidden shadow-lg bg-white mx-2">
            <img className="w-full h- object-cover" src={vedio.thumbnail} alt="Thumbnail" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{vedio.title}</h3>
              <h4 className="text-sm text-gray-600">{vedio.description}</h4>
              <a className='text-blue-600' target='_blank' href={vedio.videoFile}>Click here to watch</a>
            </div>
          </div>
        );
      })
    ) : (
      <p>No videos found</p>
    )
}
</div>
  )
}

export default Vedios