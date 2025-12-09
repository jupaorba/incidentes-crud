import { createClient } from "@libsql/client";

async function testConnection() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("Testing Turso connection...");
  console.log("URL:", url);
  console.log("Token length:", authToken?.length);

  if (!url || !authToken) {
    console.error("❌ Missing environment variables");
    process.exit(1);
  }

  try {
    const client = createClient({
      url,
      authToken,
    });

    console.log("✅ Client created successfully");

    const result = await client.execute("SELECT * FROM Incident LIMIT 5");
    console.log("✅ Query executed successfully");
    console.log("Rows returned:", result.rows.length);
    console.log("Data:", result.rows);

    await client.close();
    console.log("✅ Connection test passed!");
  } catch (error) {
    console.error("❌ Connection test failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
