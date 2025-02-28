/*
  Warnings:

  - Added the required column `creatorName` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Opportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TEXT,
    "type" TEXT NOT NULL,
    "creatorEmail" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Opportunity" ("createdAt", "creatorEmail", "deadline", "description", "id", "title", "type", "updatedAt", "creatorName") 
SELECT 
    "createdAt", 
    "creatorEmail", 
    "deadline", 
    "description", 
    "id", 
    "title", 
    "type", 
    "updatedAt",
    "Unknown" as "creatorName"
FROM "Opportunity";
DROP TABLE "Opportunity";
ALTER TABLE "new_Opportunity" RENAME TO "Opportunity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
