import { Link } from "react-router-dom";
import "../css/Navigation.css";

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <img
            className="speech-to-text-icon"
            src="https://cdn-icons-png.flaticon.com/128/25/25682.png"
            alt="speech-to-text-icon"
          />
          <Link to="/">Speech to Text</Link>
        </li>
        <br />
        <li>
          <img
            className="upload-to-text-icon"
            src="https://cdn-icons-png.flaticon.com/128/5082/5082617.png"
            alt="upload-to-text-icon"
          />
          <Link to="/uploadaudio">Upload to Text</Link>
        </li>
      </ul>
    </nav>
  );
}
