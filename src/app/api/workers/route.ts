import { NextResponse } from "next/server";
import { getWorkers } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const workers = await getWorkers();
    return NextResponse.json({ success: true, data: workers });
  } catch (error) {
    console.error("GET workers error:", error);
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
  }
}
