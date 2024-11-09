import React, { useState, useEffect } from "react";
import axios from "axios";

function ImageCaptionGenerator() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  const generateCaption = async() => {

    if(!imageFile || cooldown){
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    setLoading(true);
    setCooldown(true);
    setRemainingTime(10);
    try {
      const response = await axios.post("http://localhost:5000/generate-caption", formData, {
        headers: { "Content-Type": "multipart/form-data"
         },
      });

      setCaption(response.data.caption);
      
    } catch (error) {
      console.error("Error:", error);
      setCaption("Error generating caption. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    if(!cooldown){
      return;
    }

    const countdown = setInterval(() => {
      setRemainingTime((prev) => {
        if(prev <= 1){
          clearInterval(countdown);
          setCooldown(false);
          return 0;
        }
        return prev-1; 
      })
    }, 1000);

    return () => clearInterval(countdown);
  }, [cooldown])

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg items-center">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Image Caption Generator</h1>
      <h2 className="text-center text-2xl mb-2">Generate captions for your next instagram post</h2>

      <div className="flex justify-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {uploadedImage ? (
        <div className="flex justify-center">
          <img src={uploadedImage} className="border-2 border-blue-500 max-h-80"></img>
        </div>
      ) : (
        <h2 className="text-center">No image uploaded</h2>
      )}
      
      <div className="flex justify-center mt-4"><button onClick={generateCaption} disabled={loading} className="items-center justify-center border p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">{cooldown ? `Please Wait ${remainingTime}s` : 'Generate caption'}</button></div>

      {loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : (
        <p className="text-center text-gray-700 mt-4 font-semibold">{caption}</p>
      )}      
    </div>
  );
}

export default ImageCaptionGenerator;
