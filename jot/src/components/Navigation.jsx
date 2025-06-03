import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="column1">
      <ul>
        <li>
          <Link to="/">Speech to Text</Link>
        </li>
        <li>
          <Link to="/uploadaudio">Audio to Text</Link>
        </li>
      </ul>
    </nav>
  );
}
