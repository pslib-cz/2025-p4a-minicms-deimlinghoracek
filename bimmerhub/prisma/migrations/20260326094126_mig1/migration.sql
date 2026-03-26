-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT
);
INSERT INTO "new_Series" ("coverImage", "description", "id", "name", "slug") SELECT "coverImage", "description", "id", "name", "slug" FROM "Series";
DROP TABLE "Series";
ALTER TABLE "new_Series" RENAME TO "Series";
CREATE UNIQUE INDEX "Series_name_key" ON "Series"("name");
CREATE UNIQUE INDEX "Series_slug_key" ON "Series"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
