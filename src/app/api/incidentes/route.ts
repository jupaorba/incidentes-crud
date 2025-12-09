import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// GET ALL INCIDENTS
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const severity = searchParams.get("severity");

  try {
    let sql = "SELECT * FROM Incident WHERE 1=1";
    const args: string[] = [];

    if (status) {
      sql += " AND status = ?";
      args.push(status);
    }
    if (severity) {
      sql += " AND severity = ?";
      args.push(severity);
    }

    sql += " ORDER BY createdAt DESC";

    const result = await client.execute({ sql, args });
    const plainRows = result.rows.map((row) => JSON.parse(JSON.stringify(row)));
    return NextResponse.json(plainRows);
  } catch (error) {
    console.error("Error fetching incidents:", error);
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

    const incident = await db.incident.create({
      title,
      description,
      severity: severity || "Media",
      status: status || "Abierto",
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error("Error creating incident:", error);
    return NextResponse.json(
      { error: "Error creating incident" },
      { status: 500 }
    );
  }
}
