import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE INCIDENT
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    const { status, severity, title, description } = body;

    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(severity && { severity }),
        ...(title && { title }),
        ...(description && { description }),
      },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating incident" },
      { status: 500 }
    );
  }
}

// DELETE INCIDENT
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    await prisma.incident.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Incident deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting incident" },
      { status: 500 }
    );
  }
}
