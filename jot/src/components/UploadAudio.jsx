import { useState, useRef } from "react";

//Upload Media file convert to base 64 and transcribe

//Basic req

//1. Allow media to be uploaded, strictly mp4 for now✅
//2. Convert said media to audio/wav
//3. Put audio file through transcription
//4. Display transcription

//consider WAV

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  //   const [errorFormatMessage, setErrorFormatMessage] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const audioChunksRef = useRef([]);

  function handleUpload() {
    if (!file) {
      console.log("No file selected.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    console.log(file);
  }

  return (
    <>
      <input
        type="file"
        accept=".mp4"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      {/* <h1>{errorFormatMessage}</h1> */}
    </>
  );
}
