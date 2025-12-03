-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'video',
    "duration" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isHd" BOOLEAN NOT NULL DEFAULT false,
    "coverUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "performer" TEXT NOT NULL,
    "ageBadge" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdBy" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Video_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("ageBadge", "categoryId", "coverUrl", "createdAt", "createdBy", "duration", "id", "isHd", "performer", "title", "type", "updatedAt", "videoUrl", "views") SELECT "ageBadge", "categoryId", "coverUrl", "createdAt", "createdBy", "duration", "id", "isHd", "performer", "title", "type", "updatedAt", "videoUrl", "views" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE INDEX "Video_createdBy_idx" ON "Video"("createdBy");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
