import "./App.css";
import { Routes, Route } from "react-router-dom";
// import AudioRecorder from "./components/AudioRecorder";
import UploadAudio from "./components/UploadAudio";
import Navigation from "./components/Navigation";
import AuthForm from "./components/AuthForm";
import { useState } from "react";
import TranscriptManager from "./components/TranscriptManager";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  if (!isAuth) {
    return <AuthForm onAuthComplete={setIsAuth} />
  }
  return (
    <>
      <div className="app-container">
        <Navigation />
        <div className="column2">
          <Routes>
            <Route path="/login" element={<AuthForm />} />
            <Route path="/" element={<TranscriptManager />} />
            <Route path="/uploadaudio" element={<UploadAudio />} />
          </Routes>
        </div>
        {/* <div className="column3" /> */}
      </div>
    </>
  );
}

export default App;
