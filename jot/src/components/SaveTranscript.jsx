import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
export default function SaveTranscript() {
  const createDoc = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("Hello World"),
                new TextRun({
                  text: "Foo Bar",
                  bold: true,
                }),
                new TextRun({
                  text: "\tGithub is the best",
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
