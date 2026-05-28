-- SQL script to manually add the isDeptAdmin column to the employees table in Supabase PostgreSQL
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "isDeptAdmin" BOOLEAN NOT NULL DEFAULT FALSE;
