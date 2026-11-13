import { NextResponse } from "next/server";
import { getIssues, createIssue } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { IssueCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const citizenId = searchParams.get("citizenId") || undefined;
    const assignedWorkerId = searchParams.get("assignedWorkerId") || undefined;

    const issues = await getIssues({
      status,
      category,
      city,
      search,
      citizenId,
      assignedWorkerId,
    });

    return NextResponse.json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, latitude, longitude, address, city, imageUrl } = body;

    if (!title || !description || !category || latitude === undefined || longitude === undefined || !address || !city) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, category, coordinates, address, city" },
        { status: 400 }
      );
    }

    const created = await createIssue({
      title,
      description,
      category: category as IssueCategory,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      city,
      imageUrl: imageUrl || null,
      citizenId: session.id,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/issues error:", error);
    return NextResponse.json({ error: "Failed to report issue" }, { status: 500 });
  }
}
