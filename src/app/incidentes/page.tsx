import { prisma } from "@/lib/prisma";
import IncidentList from "./incident-list";

// Revalidate every 60 seconds (or 0 for always fresh)
// For a dashboard, we might want to opt-out of caching or revalidate often
export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const incidents = await prisma.incident.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <IncidentList incidents={incidents} />;
}
