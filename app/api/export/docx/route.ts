import { NextResponse } from "next/server";
import { generateCommentDocx } from "@/lib/docx";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = typeof body.title === "string" && body.title.trim().length > 0
      ? body.title.trim()
      : "学生年终评语";
    const comments = Array.isArray(body.comments) ? body.comments : [];

    if (comments.length === 0) {
      return NextResponse.json({ error: "没有可导出的评语" }, { status: 400 });
    }

    const buffer = await generateCommentDocx({
      title,
      comments,
    });

    const filename = `${title}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    console.error("导出 Word 失败", error);
    return NextResponse.json(
      { error: "导出 Word 失败，请稍后重试" },
      { status: 500 }
    );
  }
}
