import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

async function checkEmployees() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    const empRes = await client.query("SELECT id, name, email FROM employees");
    console.log("Total Employees:", empRes.rowCount);
    console.log("Employees List:", empRes.rows);
  } catch (err: any) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkEmployees();
