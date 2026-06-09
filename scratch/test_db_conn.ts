import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("DATABASE_URL is undefined");
    return;
  }
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log("Successfully connected to DATABASE_URL!");
    
    // Check if table fcm_tokens exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'fcm_tokens'
      );
    `);
    const tableExists = tableCheck.rows[0].exists;
    console.log("Table 'fcm_tokens' exists:", tableExists);

    if (tableExists) {
      const countRes = await client.query("SELECT COUNT(*) FROM fcm_tokens");
      console.log("Number of rows in 'fcm_tokens':", countRes.rows[0].count);
      
      const rowsRes = await client.query("SELECT * FROM fcm_tokens LIMIT 5");
      console.log("FCM tokens samples:", rowsRes.rows);
    } else {
      console.log("Table 'fcm_tokens' does NOT exist in the database! We need to run migrations.");
    }
  } catch (err: any) {
    console.error("Connection failed:", err.message || err);
  } finally {
    await client.end();
  }
}

testConnection();
