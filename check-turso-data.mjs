import { createClient } from "@libsql/client";

async function checkConnection() {
  console.log("=== Verificando conexión a Turso ===");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log(
    "TURSO_AUTH_TOKEN:",
    process.env.TURSO_AUTH_TOKEN
      ? `${process.env.TURSO_AUTH_TOKEN.substring(0, 20)}...`
      : "NO DEFINIDO"
  );

  if (!process.env.DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("❌ Variables de entorno no están definidas");
    process.exit(1);
  }

  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Insertar un registro de prueba
    console.log("\n📝 Insertando registro de prueba...");
    const insertResult = await client.execute({
      sql: `INSERT INTO Incident (title, description, status, severity, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
            RETURNING *`,
      args: [
        "Test desde script",
        "Este es un registro de prueba",
        "Abierto",
        "Alta",
      ],
    });
    console.log("✅ Registro insertado:", insertResult.rows[0]);

    // Listar todos los registros
    console.log("\n📋 Listando todos los registros...");
    const result = await client.execute(
      "SELECT * FROM Incident ORDER BY createdAt DESC"
    );
    console.log(`✅ Total de registros: ${result.rows.length}`);
    result.rows.forEach((row, index) => {
      console.log(`\n${index + 1}.`, row);
    });

    await client.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkConnection();
