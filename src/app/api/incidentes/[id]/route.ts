// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// // UPDATE INCIDENT
// export async function PATCH(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id: idStr } = await params;
//     const id = parseInt(idStr);
//     const body = await request.json();
//     const { status, severity, title, description } = body;

//     const updatedIncident = await prisma.incident.update(id, {
//       ...(status && { status }),
//       ...(severity && { severity }),
//       ...(title && { title }),
//       ...(description && { description }),
//     });

//     return NextResponse.json(updatedIncident);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error updating incident" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE INCIDENT
// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id: idStr } = await params;
//     const id = parseInt(idStr);

//     await prisma.incident.delete(id);

//     return NextResponse.json({ message: "Incident deleted successfully" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error deleting incident" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- TIPOS DE PARAMS ---
// Next.js App Router pasa el objeto 'params' directamente, no dentro de una Promise.
// Corregimos la destructuración de { params } y el tipado.

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

    const updatedIncident = await prisma.incident.update(id, {
      ...(status && { status }),
      ...(severity && { severity }),
      ...(title && { title }),
      ...(description && { description }),
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(error);
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

    await prisma.incident.delete(id);

    return NextResponse.json({ message: "Incident deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting incident" },
      { status: 500 }
    );
  }
}
