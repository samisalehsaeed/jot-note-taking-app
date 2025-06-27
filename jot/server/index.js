//Server creation
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const { readFile } = require("fs/promises");
const fs = require("fs/promises");
// const { spawn } = require("child_process");

// const { SpeechClient } = require("@google-cloud/speech");
// const { stderr } = require("process");
// const client = new SpeechClient();

//DeepSpeech

const DeepSpeech = require("deepspeech");
const Fs = require("fs");
const Sox = require("sox-stream");
const MemoryStream = require("memory-stream");
const Duplex = require("stream").Duplex;
const Wav = require("node-wav");

let modelPath = "./models/deepspeech-0.9.3-models.scorer";
let scorerPath = "./models/deepspeech-0.9.3-models.scorer";

let model = new DeepSpeech.Model(modelPath);
let desiredSampleRate = model.sampleRate();
model.enableExternalScorer(scorerPath);

function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); //connects frontend to backend
app.use(express.json({ limit: "10mb" })); //json will be in the request body and only allow upto 10mb since base64 can be big

app.post("/transcribe", async (req, res) => {
  try {
    const { audioContent } = req.body; //stores the audio content from frontend encoded as a base64 string
    const audioBuffer = Buffer.from(audioContent, "base64"); // convert to buffer
    // const config = {
    //   encoding: "WEBM_OPUS",
    //   sampleRateHertz: 48000, //16000
    //   languageCode: "en-UK", //have a request sent to language code to update it, depending on what the user selects
    //   enableAutomaticPunctuation: true,
    // };
    // const request = {
    //   audio,
    //   config,
    // };
    const transcription = model.stt(audioBuffer); //deepspeech transcription
    res.json({ transcription }); //send transcription
    // const [response] = await client.recognize(request);
    // const transcription = response.results
    //   .map((result) => result.alternatives[0].transcript)
    //   .join(" ");
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
      // enableAutomaticPunctuation: true,
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
