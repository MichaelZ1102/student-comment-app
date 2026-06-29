import { Document, Paragraph, TextRun, Packer } from "docx";

export interface CommentDocOptions {
  title: string;
  comments: Array<{
    studentName: string;
    content: string;
  }>;
}

export async function generateCommentDocx({
  title,
  comments,
}: CommentDocOptions): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
              }),
            ],
          }),
          ...comments.flatMap((item) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.studentName}：`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun(item.content)],
            }),
            new Paragraph({
              children: [new TextRun("")],
            }),
          ]),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
