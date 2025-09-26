/*
  Warnings:

  - Added the required column `musteriMail` to the `Ariza` table without a default value. This is not possible if the table is not empty.
  - Made the column `musteriImza` on table `Ariza` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teknisyenImza` on table `Ariza` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firmaIsmi` to the `Bakim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muhendisAdi` to the `Bakim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `musteriMail` to the `Bakim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tezgahSeriNo` to the `Bakim` table without a default value. This is not possible if the table is not empty.
  - Made the column `musteriImza` on table `Bakim` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teknisyenImza` on table `Bakim` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ariza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firmaIsmi" TEXT NOT NULL,
    "tezgahSeriNo" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "musteriIsmi" TEXT NOT NULL,
    "muhendisAdi" TEXT NOT NULL,
    "musteriImza" TEXT NOT NULL,
    "teknisyenImza" TEXT NOT NULL,
    "musteriMail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Ariza" ("aciklama", "createdAt", "firmaIsmi", "id", "muhendisAdi", "musteriImza", "musteriIsmi", "teknisyenImza", "tezgahSeriNo") SELECT "aciklama", "createdAt", "firmaIsmi", "id", "muhendisAdi", "musteriImza", "musteriIsmi", "teknisyenImza", "tezgahSeriNo" FROM "Ariza";
DROP TABLE "Ariza";
ALTER TABLE "new_Ariza" RENAME TO "Ariza";
CREATE TABLE "new_Bakim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "musteriAdi" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "musteriImza" TEXT NOT NULL,
    "teknisyenImza" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "musteriMail" TEXT NOT NULL,
    "firmaIsmi" TEXT NOT NULL,
    "tezgahSeriNo" TEXT NOT NULL,
    "muhendisAdi" TEXT NOT NULL
);
INSERT INTO "new_Bakim" ("aciklama", "createdAt", "id", "musteriAdi", "musteriImza", "teknisyenImza") SELECT "aciklama", "createdAt", "id", "musteriAdi", "musteriImza", "teknisyenImza" FROM "Bakim";
DROP TABLE "Bakim";
ALTER TABLE "new_Bakim" RENAME TO "Bakim";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
