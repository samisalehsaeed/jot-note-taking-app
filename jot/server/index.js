//Server creation
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { SpeechClient } = require("@google-cloud/speech");
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

app.listen(port, () => {
  //confirms server is running
  console.log(`Server running on http://localhost:${port}`);
});

// rs to restart nodemon server
