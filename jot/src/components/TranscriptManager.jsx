import { useState } from "react";
import AudioRecorder from "./AudioRecorder";


const TranscriptManager = () => {
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcript, setTranscript] = useState("");

    function updateAudioBlob(newAudioBlob) {
        setAudioBlob(newAudioBlob)
    }

    const updateTranscript = (newTranscript) => {
        setTranscript(newTranscript)
    }
    return (
        <AudioRecorder
            audioBlob={audioBlob}
            transcript={transcript}
            updateTranscript={updateTranscript}
            updateAudioBlob={updateAudioBlob} />
    )
}

export default TranscriptManager;