import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ALL INCIDENTS
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const severity = searchParams.get("severity");

  try {
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (severity) whereClause.severity = severity;

    const incidents = await prisma.incident.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(incidents);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching incidents" },
      { status: 500 }
    );
  }
}

// CREATE INCIDENT
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, severity, status } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        severity: severity || "Media",
        status: status || "Abierto",
      },
    });
    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating incident" },
      { status: 500 }
    );
  }
}
