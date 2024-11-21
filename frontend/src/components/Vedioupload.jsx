// src/components/VideoUploadForm.jsx
import { useState } from "react";

const VideoUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !videoFile || !thumbnailFile) {
      alert("Please fill in all fields and upload files.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);

    // Mocking API Call
    console.log("Uploading...");
    console.log([...formData.entries()]);
    alert("Video uploaded successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded shadow-md">
      <h1 className="text-2xl font-semibold text-blue-400 mb-6">
        Upload Your Video
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Video Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            rows="4"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Video File */}
        <div>
          <label className="block text-sm font-medium mb-1">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded focus:outline-none"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="w-full px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Upload Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;
