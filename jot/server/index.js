//Server creation
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const { readFile } = require("fs/promises");
const fs = require("fs/promises");

const { SpeechClient } = require("@google-cloud/speech");
const { stderr } = require("process");
const client = new SpeechClient();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); //connects frontend to backend
app.use(express.json({ limit: "10mb" })); //json will be in the request body and only allow upto 10mb since base64 can be big

app.post("/transcribe", async (req, res) => {
  try {
    const { audioContent } = req.body; //stores the audio content from frontend encoded as a base64 string
    const audio = {
      content: audioContent, //stores and prepares the audio for the api to transcribe
    };
    const config = {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000, //16000
      languageCode: "en-UK",
    };
    const request = {
      audio,
      config,
    };
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    res.json({ transcription }); //sends transcription to frontend
  } catch (error) {
    console.error("API error: ", error);
    res.status(500).json({ error: "Failed to transcribe" });
  }
}); //runs when post request is made

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  const inputPath = req.file.path; // file uploaded from frontend
  const outputPath = path.join("uploads", `${req.file.filename}.webm`);
  try {
    await new Promise((resolve, reject) =>
      exec(
        `ffmpeg -i ${inputPath} -vn -c:a libopus -ar 48000 -ac 1 ${outputPath}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error("Conversion error: ", stderr);
            return reject("Audio conversion failed");
          }
          console.log("Conversion successful");
          resolve();
        }
      )
    );
    const fileBuffer = await readFile(outputPath);
    const audioContent = fileBuffer.toString("base64");

    const audio = { content: audioContent };
    const config = {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000, //16000
      languageCode: "en-UK",
    };
    const request = {
      audio,
      config,
    };
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);

    res.json({ transcription });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to process and transcribe audio" });
  }
});

app.listen(port, () => {
  //confirms server is running
  console.log(`Server running on http://localhost:${port}`);
});

// rs to restart nodemon server
