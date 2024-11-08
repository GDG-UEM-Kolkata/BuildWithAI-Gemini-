const dotenv = require('dotenv');
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { GoogleAIFileManager }= require("@google/generative-ai/server")
const {  GoogleGenerativeAI } = require("@google/generative-ai");
dotenv.config();
const app = express();
const port = 5000;
const cors = require('cors')
// Set up Multer for file uploads
const upload = multer({ dest: "uploads/" });
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true
}));
// Endpoint for generating caption
app.post("/generate-caption", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Initialize GoogleAIFileManager to upload the image
    // console.log(process.env.GEMINI_API_KEY,"ENV")
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "image/jpeg",
      displayName: "Uploaded Image",
    });

    console.log(`File uploaded as: ${uploadResult.file.uri}`);

    // Initialize the Google Generative AI instance
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate caption for the uploaded image
    const result = await model.generateContent([
      "Generate a short creative sarcastic caption for this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    // Extract the caption text
    const caption = result.response.text();

    res.status(200).json({ caption });
    fs.unlinkSync(filePath); // Clean up uploaded file
  } catch (error) {
    console.error("Error generating caption:", error);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
