import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyBHl2eCfcUim49UEVKtY35pqW1yCevvATw");

import { getSchema } from './db.js';

export async function generateSQL(question) {
  const schema = await getSchema();
  const schemaDescription = Object.entries(schema)
    .map(([table, columns]) => `${table}(${columns.join(', ')})`)
    .join('\n');

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert in PostgreSQL.
Here is the database schema:

${schemaDescription}

Convert the following natural language question into a PostgreSQL SELECT query.
Rules:
- Use only tables and columns listed in the schema.
- Do NOT use INSERT, UPDATE, DELETE, DROP, ALTER, CREATE.
- Return only the SQL query (no explanation).

Question: "${question}"
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
