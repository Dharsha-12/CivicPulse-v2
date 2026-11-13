import { NextResponse } from "next/server";
import { upvoteIssue } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await upvoteIssue(id);
    return NextResponse.json({ success: true, upvotes: updated.upvotes });
  } catch (error) {
    console.error("POST upvote error:", error);
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
