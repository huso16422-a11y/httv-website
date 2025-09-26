/*
  Warnings:

  - You are about to drop the column `muhendisIsmi` on the `Bakim` table. All the data in the column will be lost.
  - Added the required column `muhendisAdi` to the `Bakim` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bakim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firmaIsmi" TEXT NOT NULL,
    "tezgahSeriNo" TEXT NOT NULL,
    "tezgahSaati" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "musteriIsmi" TEXT NOT NULL,
    "muhendisAdi" TEXT NOT NULL,
    "musteriImza" TEXT,
    "teknisyenImza" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Bakim" ("aciklama", "createdAt", "firmaIsmi", "id", "musteriIsmi", "tezgahSaati", "tezgahSeriNo") SELECT "aciklama", "createdAt", "firmaIsmi", "id", "musteriIsmi", "tezgahSaati", "tezgahSeriNo" FROM "Bakim";
DROP TABLE "Bakim";
ALTER TABLE "new_Bakim" RENAME TO "Bakim";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
