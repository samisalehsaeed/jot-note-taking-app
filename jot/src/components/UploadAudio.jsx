import { useState } from "react";

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  //   const [audioBlob, setAudioBlob] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    // setAudioBlob(file);
    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Transcription: ", data.transcription);
      setTranscription(data.transcription);
    } catch (err) {
      console.error("Upload error: ", err);
    }
  };

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

      <h1>{transcription && <p>Transcript: {transcription}</p>}</h1>
      {/* <h1>{errorFormatMessage}</h1> */}
    </>
  );
}
