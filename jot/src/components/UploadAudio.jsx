import { useState, useRef } from "react";

//Upload Media file convert to base 64 and transcribe

//Basic req

//1. Allow media to be uploaded, strictly videos/audio files.
//2. Convert said media to audio/wav
//3. Put audio file through transcription
//4. Display transcription

//consider WAV

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const audioChunksRef = useRef([]);

  function handleUpload() {
    if (!file) {
      console.log("No file selected.");
      return;
    }
    // if (file.type != "mp4") {
    //   console.log("Incorrect format: ", file.type); // refine, doesnt work at all
    // }
    const fd = new FormData();
    fd.append("file", file);
    console.log(file);
  }

  const audioCode = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    setAudioBlob(audioBlob);
    audioChunksRef.current = [];
  };

  const transcribeAudio = async () => {
    const blobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
    const base64Audio = await blobToBase64(audioBlob);
    const response = await fetch("http://localhost:5000/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioContent: base64Audio }),
    });

    const data = await response.json();
    console.log("Transcription:", data.transcription);
    setTranscript(data.transcription);
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Upload</button>
    </>
  );
}
