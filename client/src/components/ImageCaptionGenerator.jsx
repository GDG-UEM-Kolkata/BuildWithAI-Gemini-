import React, { useState } from "react";
import axios from "axios";

function ImageCaptionGenerator() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/generate-caption", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCaption(response.data.caption);
    } catch (error) {
      console.error("Error:", error);
      setCaption("Error generating caption");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg ">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Image Caption Generator</h1>
      
      <div className="flex justify-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : (
        <p className="text-center text-gray-700 mt-4">{caption}</p>
      )}
    </div>
  );
}

export default ImageCaptionGenerator;
