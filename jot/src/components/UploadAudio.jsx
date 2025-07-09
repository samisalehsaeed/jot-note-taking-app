import { useState, createContext } from "react";
import "../css/UploadAudio.css";
import upload from "../assets/upload.svg";
import SaveTranscript from "./SaveTranscript";

export const UploadTranscriptContext = createContext();

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected.");
      return;
    }
    const formData = new FormData();
    formData.append("audio", file);
    try {
      const res = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setTranscription(data.transcription);
    } catch (err) {
      console.error("Upload error: ", err);
    }
  };

  return (
    <>
      <input
        className="selectFile"
        type="file"
        id="input"
        accept="audio/*,video/*"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <label htmlFor="input">
        <img
          className="selectFileIcon"
          src="https://cdn-icons-png.flaticon.com/128/2572/2572200.png"
          alt="selectAudioFile-icon"
        />
      </label>

      <button onClick={handleUpload}>
        <img className="uploadIcon" src={upload} alt="upload-icon" />
      </button>
      <div className="transcript-paper">
        <UploadTranscriptContext.Provider value={transcription}>
          <SaveTranscript />
        </UploadTranscriptContext.Provider>
        <h1>{transcription && <p>{transcription}</p>}</h1>
      </div>
    </>
  );
}
