import { NextResponse } from "next/server";
import { generateComment, GenerateCommentParams } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateCommentParams>;

    const studentName = typeof body.studentName === "string" ? body.studentName.trim() : "";
    const tone = (typeof body.tone === "string" && ["formal", "warm", "plain"].includes(body.tone))
      ? (body.tone as GenerateCommentParams["tone"])
      : "warm";
    const highlights = typeof body.highlights === "string" ? body.highlights.trim() : "";
    const improvements = typeof body.improvements === "string" ? body.improvements.trim() : "";

    if (!studentName) {
      return NextResponse.json({ error: "缺少学生姓名" }, { status: 400 });
    }

    const result = await generateComment({
      studentName,
      tone,
      highlights,
      improvements,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("生成评语失败", error);
    return NextResponse.json(
      { error: "生成评语失败，请稍后重试" },
      { status: 500 }
    );
  }
}
