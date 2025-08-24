import { useState, useRef, createContext } from "react";
import "../css/AudioRecorder.css";
import SaveTranscript from "./SaveTranscript";
// import TranscriptManager from "./TranscriptManager";

export const AudioTranscriptContext = createContext();

const AudioRecorder = ({ audioBlob, transcript, updateTranscript, updateAudioBlob }) => {

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      console.log("updateAudioBlob type:", typeof updateAudioBlob);
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      console.log("Audio Blob:", audioBlob)
      updateAudioBlob(audioBlob);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const transcribeAudio = async () => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    const response = await fetch("http://localhost:5000/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Transcription:", data.transcription);
    updateTranscript(data.transcription);

  };


  return (
    <div className="audio-recorder">
      <br />
      <button
        type="button"
        className="record-btn"
        onClick={isRecording ? stopRecording : startRecording}
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
      <p>Please press "Stop Recording" prior to transcribing the audio</p>
      <br />
      {audioBlob && <audio src={URL.createObjectURL(audioBlob)} controls />}
      <br />
      <button onClick={transcribeAudio}>Transcribe Audio</button>

      <br />
      <br />
      <div className="transcript-paper">
        <AudioTranscriptContext.Provider value={transcript}>
          <SaveTranscript />
        </AudioTranscriptContext.Provider>
        <h1>{transcript && <p>{transcript}</p>}</h1>
      </div>
    </div>
  );
};

export default AudioRecorder;
