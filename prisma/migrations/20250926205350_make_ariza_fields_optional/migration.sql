-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ariza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firmaIsmi" TEXT,
    "tezgahSeriNo" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "musteriIsmi" TEXT NOT NULL,
    "musteriMail" TEXT NOT NULL,
    "muhendisAdi" TEXT,
    "musteriImza" TEXT,
    "teknisyenImza" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Ariza" ("aciklama", "createdAt", "firmaIsmi", "id", "muhendisAdi", "musteriImza", "musteriIsmi", "musteriMail", "teknisyenImza", "tezgahSeriNo") SELECT "aciklama", "createdAt", "firmaIsmi", "id", "muhendisAdi", "musteriImza", "musteriIsmi", "musteriMail", "teknisyenImza", "tezgahSeriNo" FROM "Ariza";
DROP TABLE "Ariza";
ALTER TABLE "new_Ariza" RENAME TO "Ariza";
CREATE TABLE "new_Bakim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firmaIsmi" TEXT,
    "tezgahSeriNo" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "musteriAdi" TEXT NOT NULL,
    "musteriMail" TEXT NOT NULL,
    "muhendisAdi" TEXT,
    "musteriImza" TEXT,
    "teknisyenImza" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Bakim" ("aciklama", "createdAt", "firmaIsmi", "id", "muhendisAdi", "musteriAdi", "musteriImza", "musteriMail", "teknisyenImza", "tezgahSeriNo") SELECT "aciklama", "createdAt", "firmaIsmi", "id", "muhendisAdi", "musteriAdi", "musteriImza", "musteriMail", "teknisyenImza", "tezgahSeriNo" FROM "Bakim";
DROP TABLE "Bakim";
ALTER TABLE "new_Bakim" RENAME TO "Bakim";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
