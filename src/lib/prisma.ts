import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = {
  incident: {
    async findMany(options?: { orderBy?: { createdAt: "asc" | "desc" } }) {
      const order = options?.orderBy?.createdAt === "desc" ? "DESC" : "ASC";
      const result = await client.execute({
        sql: `SELECT * FROM Incident ORDER BY createdAt ${order}`,
        args: [],
      });
      // Convert to plain objects for Next.js serialization
      return result.rows.map((row) => JSON.parse(JSON.stringify(row)));
    },

    async findUnique(id: number) {
      const result = await client.execute({
        sql: "SELECT * FROM Incident WHERE id = ?",
        args: [id],
      });
      const row = result.rows[0];
      return row ? JSON.parse(JSON.stringify(row)) : null;
    },

    async create(data: {
      title: string;
      description: string;
      status?: string;
      severity?: string;
    }) {
      const result = await client.execute({
        sql: `INSERT INTO Incident (title, description, status, severity, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
              RETURNING *`,
        args: [
          data.title,
          data.description,
          data.status || "Abierto",
          data.severity || "Media",
        ],
      });
      return JSON.parse(JSON.stringify(result.rows[0]));
    },

    async update(
      id: number,
      data: Partial<{
        title: string;
        description: string;
        status: string;
        severity: string;
      }>
    ) {
      const updates: string[] = [];
      const args: any[] = [];

      if (data.title) {
        updates.push("title = ?");
        args.push(data.title);
      }
      if (data.description) {
        updates.push("description = ?");
        args.push(data.description);
      }
      if (data.status) {
        updates.push("status = ?");
        args.push(data.status);
      }
      if (data.severity) {
        updates.push("severity = ?");
        args.push(data.severity);
      }

      updates.push("updatedAt = datetime('now')");
      args.push(id);

      const result = await client.execute({
        sql: `UPDATE Incident SET ${updates.join(
          ", "
        )} WHERE id = ? RETURNING *`,
        args,
      });
      return JSON.parse(JSON.stringify(result.rows[0]));
    },

    async delete(id: number) {
      await client.execute({
        sql: "DELETE FROM Incident WHERE id = ?",
        args: [id],
      });
    },
  },
};

// Mantener compatibilidad con el código existente
export const prisma = db;
