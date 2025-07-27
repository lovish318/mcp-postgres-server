import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { Client } = pkg;

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),
});

try {
  await client.connect();
  console.log("✅ Connected to PostgreSQL database");
} catch (error) {
  console.error("❌ Failed to connect to PostgreSQL database:", error.message);
  process.exit(1); // Exit the process if the connection fails
}

async function ensureConnected() {
  if (!client._connected) {
    try {
      await client.connect();
      console.log("✅ Reconnected to PostgreSQL database");
    } catch (error) {
      console.error("❌ Failed to reconnect to PostgreSQL database:", error.message);
      throw error;
    }
  }
}

export async function executeSQL(query) {
  try {
    await ensureConnected();
    // Remove backticks and the 'sql' keyword from the query
    const sanitizedQuery = query.replace(/```sql/g, "").replace(/```/g, "").trim();
    const res = await client.query(sanitizedQuery);
    return res.rows;
  } catch (error) {
    console.error("❌ Error executing SQL query:", error.message);
    throw error;
  }
}

export async function getSchema() {
  const query = `
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `;

  const result = await client.query(query);

  const schema = {};
  result.rows.forEach(row => {
    if (!schema[row.table_name]) {
      schema[row.table_name] = [];
    }
    schema[row.table_name].push(row.column_name);
  });

  return schema;
}

