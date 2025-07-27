# Natural language Postgres Server

This project is a Node.js server that connects to a PostgreSQL database. It includes utilities for AI and database interactions in natural language.

---

## Features
- ✅ Converts English questions to SQL queries using **Google Gemini API**
- ✅ Executes queries with **read-only PostgreSQL user**
- ✅ Prevents INSERT, UPDATE, DELETE, DROP, ALTER
- ✅ Minimal data exposure

---

## Tech Stack
- Node.js (Express)
- PostgreSQL
- Google Gemini API

---

## Setup

1. Copy `.env.example` to `.env` and configure your environment variables.
2. Run `npm install` to install dependencies.
3. Start the server using:
   ```
   npm start
   ```

---

## Environment Variables

Ensure the following variables are set in your `.env` file:

- `GEMINI_API_KEY`: Your Google Gemini API key.
- `PG_HOST`: Hostname or service name of your PostgreSQL instance.
- `PG_USER`: PostgreSQL username.
- `PG_PASSWORD`: PostgreSQL password.
- `PG_DATABASE`: Name of the PostgreSQL database.
- `PG_PORT`: Port number for PostgreSQL (default: 5432).
- `PORT`: Port number for the server (default: 3000).

---

## Usage

Send a POST request to the `/query` endpoint with the following JSON payload:

```json
{
  "question": "Your English question here"
}
```

The server will respond with the generated SQL query and the query results.

Example:

```bash
curl -X POST http://localhost:3000/query \
-H "Content-Type: application/json" \
-d '{"question": "List all records created in the last 30 days"}'
```

Response:

```json
{
  "query": "SELECT * FROM records WHERE created_at >= NOW() - INTERVAL '30 days';",
  "data": [ ... ]
}
```

---

## Production Deployment

1. Build and start the Docker containers:
   ```
   docker-compose up --build -d
   ```

2. Access the server at `http://localhost:3000`.

3. Monitor logs using:
   ```
   docker logs -f mcp_postgres_server
   ```

4. To stop the containers:
   ```
   docker-compose down
   ```
