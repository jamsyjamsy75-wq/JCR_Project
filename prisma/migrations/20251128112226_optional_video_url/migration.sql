-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isHd" BOOLEAN NOT NULL DEFAULT false,
    "coverUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "performer" TEXT NOT NULL,
    "ageBadge" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("ageBadge", "categoryId", "coverUrl", "createdAt", "duration", "id", "isHd", "performer", "title", "updatedAt", "videoUrl", "views") SELECT "ageBadge", "categoryId", "coverUrl", "createdAt", "duration", "id", "isHd", "performer", "title", "updatedAt", "videoUrl", "views" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
