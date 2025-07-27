import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { executeSQL } from './utils/db.js';
import { generateSQL } from './utils/ai.js';

if (!fs.existsSync('.env')) {
  console.error("❌ .env file not found in the project root");
  process.exit(1);
}

dotenv.config();
console.log("✅ .env file loaded successfully");

const app = express();
app.use(express.json());

app.post('/query', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });

    const sqlQuery = await generateSQL(question);

    if (/insert|update|delete|drop|alter|create/i.test(sqlQuery)) {
      return res.status(400).json({ error: "Write operations not allowed" });
    }

    const data = await executeSQL(sqlQuery);
    res.json({ query: sqlQuery, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("✅ MCP Server running on port 3000"));
