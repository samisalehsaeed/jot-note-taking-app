import { useState, useRef } from "react";
import "../css/AudioRecorder.css";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcript, setTranscript] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); //enables mic on browser
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

  //   const stopRecording = () => {};

  const transcribeAudio = async () => {
    const blobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
    mediaRecorderRef.current.stop();
    setIsRecording(false); // check if this is the reason why you cannot transcribe
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
      {/* make it that when the recording is stopped the transcription is displayed auto */}
      {/* add a potential loading screen too */}
      <button
        type="button"
        className="record-btn"
        onClick={isRecording ? transcribeAudio : startRecording}
      >
        {isRecording ? (
          "Stop Recording"
        ) : (
          <img
            className="record-icon"
            src="https://cdn-icons-png.flaticon.com/128/25/25682.png"
            alt="png-of-mic"
          />
        )}
      </button>
      {/* test - remove */}
      <br />
      {audioBlob && <audio src={URL.createObjectURL(audioBlob)} controls />}
      <br />
      {/* <button onClick={transcribeAudio}>Transcribe</button> */}
      <h1>{transcript && <p>Transcript: {transcript}</p>}</h1>
      {/* use audio blob and transcribe through api, json key downloaded already */}
    </div>
  );
};

export default AudioRecorder;
