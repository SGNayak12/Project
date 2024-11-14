import React, { useState } from 'react';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert('Please select a video file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/videos/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // If you need to send cookies
      });

      const data = await response.json();
      if (response.ok) {
        alert('Video uploaded successfully');
        // Handle any further actions (like redirecting or clearing form)
      } else {
        alert('Error uploading video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('An error occurred during upload');
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Upload Video</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-white">Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white">Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white">Select Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
