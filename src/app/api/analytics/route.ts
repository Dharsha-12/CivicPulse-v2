import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getAnalytics();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("GET analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
