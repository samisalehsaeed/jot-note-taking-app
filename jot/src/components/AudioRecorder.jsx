import { useState, useRef } from "react";
import "../css/AudioRecorder.css";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcript, setTranscript] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // remove the data:audio/wav;base64,...
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const transcribeAudio = async () => {
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
    <div className="audio-recorder">
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioBlob && <audio src={URL.createObjectURL(audioBlob)} controls />}
      <button onClick={transcribeAudio}>Transcribe</button>
      {transcript && <p>Transcript: {transcript}</p>}

      {/* use audio blob and transcribe through api, json key downloaded already */}
    </div>
  );
};

export default AudioRecorder;
