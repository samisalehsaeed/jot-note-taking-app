import { useState } from "react";
import "../css/Navigation.css"

export default function Navigation() {
  const [isExpanded, setIsExpanded] = useState(true);

  function createTranscript() {
    console.log("Creating new transcript...");
    // Add your transcript creation logic here
  }

  function toggleSidebar() {
    setIsExpanded(!isExpanded);
  }

  return (
    <aside className={`sidebar ${isExpanded ? 'sb-expanded' : 'sb-collapsed'}`}>
      <button className="collapse-btn" onClick={toggleSidebar}>
        {isExpanded ? '←' : '→'}
      </button>

      <nav className="navigation">
        <ul>
          <li>
            <a href="/" className="nav-link">
              <img
                className="nav-icon"
                src="https://cdn-icons-png.flaticon.com/128/25/25682.png"
                alt="speech-to-text-icon"
              />
              <span>Speech to Text</span>
            </a>
          </li>

          <li>
            <a href="/uploadaudio" className="nav-link">
              <img
                className="nav-icon"
                src="https://cdn-icons-png.flaticon.com/128/5082/5082617.png"
                alt="upload-to-text-icon"
              />
              <span>Upload to Text</span>
            </a>
          </li>

          {/* <li className="new-transcript-container">
            <button onClick={createTranscript} className="new-transcript-btn">
              <span className="plus-icon">+</span>
              <span>New transcript</span>
            </button>
          </li> */}
        </ul>
      </nav>
    </aside>
  )
}