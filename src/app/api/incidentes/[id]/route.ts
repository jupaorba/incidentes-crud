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

import { NextResponse, NextRequest } from "next/server"; // Agregué NextRequest
import { prisma } from "@/lib/prisma";

// --- TIPOS DE PARAMS ---
// Next.js App Router pasa el objeto 'params' directamente, no dentro de una Promise.
// Corregimos la destructuración de { params } y el tipado.

// UPDATE INCIDENT
export async function PATCH(
  request: NextRequest, // Usamos NextRequest o Request
  { params }: { params: { id: string } } // Corregido el tipado de params
) {
  try {
    const { id: idStr } = params; // Ya no necesitamos await
    // Mantenemos la conversión a Int, asumiendo que tu ID en Prisma es un Int.
    const id = parseInt(idStr);

    // Si tu ID en Prisma es String, usa: const id = idStr;

    const body = await request.json();
    const { status, severity, title, description } = body;

    // 🛑 CORRECCIÓN CLAVE: LibSQL adapter expects (id, data) as two arguments
    const updatedIncident = await prisma.incident.update(id, {
      // Aquí los campos a actualizar
      ...(status && { status }),
      ...(severity && { severity }),
      ...(title && { title }),
      ...(description && { description }),
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error(error); // Imprimir el error real en el log es útil
    return NextResponse.json(
      { error: "Error updating incident" },
      { status: 500 }
    );
  }
}

// DELETE INCIDENT
export async function DELETE(
  request: NextRequest, // Usamos NextRequest o Request
  { params }: { params: { id: string } } // Corregido el tipado de params
) {
  try {
    const { id: idStr } = params; // Ya no necesitamos await
    // Mantenemos la conversión a Int, asumiendo que tu ID en Prisma es un Int.
    const id = parseInt(idStr);

    // Si tu ID en Prisma es String, usa: const id = idStr;

    // 🛑 CORRECCIÓN CLAVE: LibSQL adapter expects just the id as argument
    await prisma.incident.delete(id);

    return NextResponse.json({ message: "Incident deleted successfully" });
  } catch (error) {
    console.error(error); // Imprimir el error real en el log es útil
    return NextResponse.json(
      { error: "Error deleting incident" },
      { status: 500 }
    );
  }
}
