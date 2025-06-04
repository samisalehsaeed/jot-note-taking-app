import "./App.css";
import { Routes, Route } from "react-router-dom";
import AudioRecorder from "./components/AudioRecorder";
import UploadAudio from "./components/UploadAudio";
import Navigation from "./components/Navigation";

function App() {
  return (
    <>
      <div className="app-container">
        <Navigation />
        <div className="column2">
          <h1 className="title">JOT</h1>
          <Routes>
            <Route path="/" element={<AudioRecorder />} />
            <Route path="/uploadaudio" element={<UploadAudio />} />
          </Routes>
        </div>
        <div className="column3" />
      </div>
    </>
  );
}

export default App;
