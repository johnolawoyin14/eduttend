const express = require("express");
const multer = require("multer");
const { Canvas, Image, ImageData } = require("canvas");
const faceapi = require("face-api.js");
const fs = require("fs");

// Set up face-api.js with canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
const port = 3000;

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// In-memory database to store face descriptors
const faceDatabase = new Map();

// Load face recognition models
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
]).then(startServer);

// Start the Express server
function startServer() {
  app.post("/register-face", upload.single("image"), async (req, res) => {
    try {
      const image = await faceapi.bufferToImage(req.file.buffer);
      const descriptor = await faceapi.computeFaceDescriptor(image);

      // Assume a user ID is sent in the request, and associate the face descriptor with that user
      const userId = req.body.userId;
      faceDatabase.set(userId, descriptor);

      res.json({ success: true, message: "Face registered successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: "Face registration failed." });
    }
  });

  app.post("/verify-face", upload.single("image"), async (req, res) => {
    try {
      const image = await faceapi.bufferToImage(req.file.buffer);
      const unknownDescriptor = await faceapi.computeFaceDescriptor(image);

      // Assume a user ID is sent in the request for verification
      const userId = req.body.userId;

      if (faceDatabase.has(userId)) {
        const registeredDescriptor = faceDatabase.get(userId);
        const isMatch = faceapi.round(
          faceapi.faceRecognitionNet.computeFaceDescriptor(
            [registeredDescriptor],
            [unknownDescriptor]
          )
        );

        res.json({ success: true, isMatch });
      } else {
        res.json({ success: false, error: "User not found." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: "Face verification failed." });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}




















// faceRecognition.js
const faceapi = require('face-api.js');
const fs = require('fs');
const path = require('path');

// Set up face-api.js with canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const referenceImagesPath = path.join(__dirname, 'reference_images');

// Load face recognition models
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
]);

async function recognizeFace(unknownDescriptor) {
  const referenceImageFiles = fs.readdirSync(referenceImagesPath);

  for (const referenceImageFile of referenceImageFiles) {
    const referenceImagePath = path.join(referenceImagesPath, referenceImageFile);
    const referenceImage = await faceapi.bufferToImage(fs.readFileSync(referenceImagePath));
    const referenceDescriptor = await faceapi.computeFaceDescriptor(referenceImage);

    const isMatch = faceapi.round(
      faceapi.faceRecognitionNet.computeFaceDescriptor([referenceDescriptor], [unknownDescriptor])
    );

    if (isMatch) {
      return { success: true, match: referenceImageFile };
    }
  }

  return { success: false, match: null };
}

module.exports = { recognizeFace };











// app.js
const express = require('express');
const multer = require('multer');
const { Canvas, Image, ImageData } = require('canvas');
const { recognizeFace } = require('./faceRecognition');

const app = express();
const port = 3000;

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to perform face recognition
app.post('/recognize-face', upload.single('image'), async (req, res) => {
  try {
    const image = await faceapi.bufferToImage(req.file.buffer);
    const unknownDescriptor = await faceapi.computeFaceDescriptor(image);

    const result = await recognizeFace(unknownDescriptor);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Face recognition failed.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});








// routes/yourRoute.js
const express = require('express');
const { recognizeFace } = require('../faceRecognition'); // Adjust the path as needed

const router = express.Router();

router.post('/your-specific-route', async (req, res) => {
  try {
    // Extract and process the image from the request
    const image = req.file.buffer; // Adjust this based on your frontend's form data
    const unknownDescriptor = await faceapi.computeFaceDescriptor(image);

    const result = await recognizeFace(unknownDescriptor);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Face recognition failed.' });
  }
});

module.exports = router;
