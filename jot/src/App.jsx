import AudioRecorder from "./components/AudioRecorder";
import "./App.css";

function App() {
  return (
    <>
      <div className="app-container">
        <div className="column1" />
        <div className="column2">
          <AudioRecorder />
        </div>
        <div className="column3" />
      </div>
    </>
  );
}

export default App;
