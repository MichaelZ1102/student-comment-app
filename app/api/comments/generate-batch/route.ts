import { NextResponse } from "next/server";
import { generateComment, GenerateCommentParams } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items: Array<{
        studentName: string;
        tone?: GenerateCommentParams["tone"];
        highlights?: string;
        improvements?: string;
      }>;
    };

    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ error: "缺少批量数据" }, { status: 400 });
    }

    const results = await Promise.all(
      items.map(async (item) => {
        const studentName = typeof item.studentName === "string" ? item.studentName.trim() : "";
        const tone = (typeof item.tone === "string" && ["formal", "warm", "plain"].includes(item.tone))
          ? (item.tone as GenerateCommentParams["tone"])
          : "formal";
        const highlights = typeof item.highlights === "string" ? item.highlights.trim() : "";
        const improvements = typeof item.improvements === "string" ? item.improvements.trim() : "";

        if (!studentName) {
          return { studentName: "", comment: "", error: "缺少学生姓名" };
        }

        try {
          const result = await generateComment({
            studentName,
            tone,
            highlights,
            improvements,
          });
          return { studentName, comment: result.comment };
        } catch (err) {
          return {
            studentName,
            comment: "",
            error: err instanceof Error ? err.message : "生成失败",
          };
        }
      })
    );

    const ordered = items.map((item, index) => results[index]);

    return NextResponse.json({ items: ordered });
  } catch (error) {
    console.error("批量生成评语失败", error);
    return NextResponse.json(
      { error: "批量生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
