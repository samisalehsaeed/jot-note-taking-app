import "./App.css";

import AudioRecorder from "./components/AudioRecorder";
import UploadAudio from "./components/UploadAudio";

function App() {
  return (
    <>
      <div className="app-container">
        <div className="column1" />
        <div className="column2">
          <AudioRecorder />
          <UploadAudio />
        </div>
        <div className="column3" />
      </div>
    </>
  );
}

export default App;
