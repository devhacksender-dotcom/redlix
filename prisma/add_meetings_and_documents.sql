-- If you have already created the meetings table, run this line to add the missing column:
-- ALTER TABLE "meetings" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create Table for meetings
CREATE TABLE IF NOT EXISTS "meetings" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "meetingLead" TEXT NOT NULL,
    "meetingLink" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Table for meeting_attendees
CREATE TABLE IF NOT EXISTS "meeting_attendees" (
    "id" SERIAL PRIMARY KEY,
    "meetingId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    CONSTRAINT "meeting_attendees_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meeting_attendees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create unique index/constraint for meeting_attendees
CREATE UNIQUE INDEX IF NOT EXISTS "meeting_attendees_meetingId_employeeId_key" ON "meeting_attendees"("meetingId", "employeeId");

-- Create Table for documents
CREATE TABLE IF NOT EXISTS "documents" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'company',
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
