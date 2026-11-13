import { NextResponse } from "next/server";
import { getIssueById, updateIssue } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { IssueStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issue = await getIssueById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    console.error("GET /api/issues/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch issue" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, resolutionNote, assignedWorkerId } = body;

    const updateData: {
      status?: IssueStatus;
      resolvedAt?: Date | null;
      resolutionNote?: string;
      assignedWorkerId?: string | null;
    } = {};

    if (status !== undefined) {
      updateData.status = status as IssueStatus;
      if (status === "RESOLVED") {
        updateData.resolvedAt = new Date();
      } else if (status === "OPEN") {
        updateData.resolvedAt = null;
      }
    }

    if (resolutionNote !== undefined) {
      updateData.resolutionNote = resolutionNote;
    }

    if (assignedWorkerId !== undefined) {
      // Admin assigning worker or worker self-assigning
      updateData.assignedWorkerId = assignedWorkerId || null;
    }

    const updated = await updateIssue(id, updateData);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/issues/[id] error:", error);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}
