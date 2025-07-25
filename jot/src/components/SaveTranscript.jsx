import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { useContext } from "react";
import { AudioTranscriptContext } from "./AudioRecorder";
import { UploadTranscriptContext } from "./UploadAudio";
import { useState } from "react";

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
export default function SaveTranscript() {
  const audioDocTranscript = useContext(AudioTranscriptContext);
  const uploadDocTranscript = useContext(UploadTranscriptContext);
  const [transcriptFileName, setTranscriptFileName] = useState();
  const createDoc = async (e) => {
    e.preventDefault();
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${audioDocTranscript || uploadDocTranscript}`,
                }),
              ],
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, transcriptFileName);
  };

  return (
    <>
      <form onSubmit={createDoc}>
        <input
          placeholder="Transcript File Name"
          value={transcriptFileName || ""}
          onChange={(e) => setTranscriptFileName(e.target.value)}
          required
        />
        <button type="submit">+</button>
      </form>
    </>
  );
}
