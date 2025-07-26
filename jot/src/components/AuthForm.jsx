import { Link } from "react-router-dom"
import "../css/AuthForm.css"


export default function AuthForm() {
    return (
        <>
            {/* maybe use html flipbook for an artistic touch */}
            <div className="auth-container">
                <h1>JOT</h1>
                <div className="auth-box">
                    <form>
                        Sign up
                        <br />
                        <input placeholder="Email"></input>
                        <br />
                        <input placeholder="Password"></input>
                    </form>
                </div>
            </div>
        </>
    )
}