const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Storage setup for uploads
const upload = multer({ dest: "uploads/" });

app.use(express.json({ limit: "100mb" }));
app.use(cors());

// In-memory job tracker
const jobs = {};

// Ensure transcripts directory exists
const transcriptsDir = path.resolve(__dirname, "transcripts");
if (!fs.existsSync(transcriptsDir)) {
  fs.mkdirSync(transcriptsDir);
}

// Upload and transcribe route
app.post("/transcribe", upload.single("audio"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const jobId = uuidv4();
  const tempPath = file.path;
  const outputPath = `transcripts/${jobId}.wav`;
  const transcriptPath = `transcripts/${jobId}.txt`;

  // Convert audio to 16-bit PCM WAV using ffmpeg
  const ffmpeg = require("child_process").spawn;
  const ffmpegProcess = ffmpeg("ffmpeg", [
    "-y", // overwrite output
    "-i",
    tempPath,
    "-ar",
    "16000",
    "-ac",
    "1",
    "-f",
    "wav",
    outputPath,
  ]);

  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`[ffmpeg stderr]: ${data}`);
  });

  ffmpegProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error("ffmpeg process failed with code", code);
      return res.status(500).json({ error: "Audio conversion failed" });
    }
    // Path to Whisper executable after CMake build
    const whisperExecutable = path.resolve(
      __dirname,
      "whisper/build/bin/whisper-cli"
    );
    // Spawn Whisper process and wait for it to finish, then return the transcript immediately
    const whisperProcess = spawn(whisperExecutable, [
      "-m",
      "./whisper/models/ggml-base.en.bin",
      "-f",
      outputPath,
      "-otxt",
      "-of",
      transcriptPath.replace(".txt", ""), // whisper appends .txt
    ]);
    whisperProcess.stdout &&
      whisperProcess.stdout.on("data", (data) => {
        console.log(`[Whisper stdout]: ${data}`);
      });
    whisperProcess.stderr &&
      whisperProcess.stderr.on("data", (data) => {
        console.error(`[Whisper stderr]: ${data}`);
      });
    whisperProcess.on("exit", (code) => {
      if (code !== 0) {
        console.error("Whisper process failed with code", code);
        return res.status(500).json({ error: "Transcription failed" });
      }
      fs.access(transcriptPath, fs.constants.F_OK, (accessErr) => {
        if (accessErr) {
          console.error("Transcript file does not exist:", accessErr);
          return res.status(500).json({ error: "Transcript file not found" });
        }
        fs.readFile(transcriptPath, "utf8", (err, data) => {
          if (err) {
            console.error("Failed to read transcript:", err);
            return res.status(500).json({ error: "Failed to read transcript" });
          }
          res.json({ transcription: data });
          // Clean up temp files
          fs.unlink(tempPath, () => {});
          fs.unlink(outputPath, () => {});
          fs.unlink(transcriptPath, () => {});
        });
      });
    });
    whisperProcess.on("error", (err) => {
      console.error("Failed to start Whisper process:", err);
      return res.status(500).json({ error: "Failed to start Whisper process" });
    });
  });
});
// Status route
app.get("/status/:jobId", (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json({ status: job.status });
});

// Fetch transcript route
app.get("/transcript/:jobId", (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job || job.status !== "done") {
    return res.status(404).json({ error: "Transcript not ready" });
  }
  res.sendFile(path.resolve(job.transcript));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
