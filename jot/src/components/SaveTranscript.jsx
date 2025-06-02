import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { useContext } from "react";
import { TranscriptContext } from "./AudioRecorder";

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
export default function SaveTranscript() {
  const docTranscript = useContext(TranscriptContext);
  const createDoc = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${docTranscript}`,
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "MyTranscript.docx");
  };

  //   FileSaver.saveAs(doc, "MyTranscription.docx");

  return <button onClick={createDoc}>Create Document</button>;
}

// Used to export the file into a .docx file
//later on allow users to name their own file

//prop drilling to pass transcription to doc
