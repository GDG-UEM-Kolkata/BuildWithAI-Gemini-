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
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {loading ? <p>Loading...</p> : <p>Caption: {caption}</p>}
    </div>
  );
}

export default ImageCaptionGenerator;
