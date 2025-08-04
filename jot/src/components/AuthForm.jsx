import "../css/AuthForm.css";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase"; // adjust path as needed
import { useNavigate } from "react-router-dom";

export default function AuthForm({ onAuthComplete }) {
    const navigate = useNavigate();
    const anonymousSignIn = async (e) => {
        e.preventDefault();
        try {
            const result = await signInAnonymously(auth);
            console.log("Signed in anonymously, UID:", result.user.uid);
            if (onAuthComplete) onAuthComplete(true);
            navigate("/");
        } catch (err) {
            console.error("Anonymous sign-in error:", err);
        }
    };
    return (
        <div className="auth-container">
            <h1>JOT</h1>
            <div className="auth-box">
                <form onSubmit={anonymousSignIn}>
                    <button type="submit">SIGN IN</button>
                </form>
            </div>
        </div>
    )
};