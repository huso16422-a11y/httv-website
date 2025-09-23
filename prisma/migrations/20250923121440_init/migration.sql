-- CreateTable
CREATE TABLE "Bakim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firmaIsmi" TEXT NOT NULL,
    "tezgahSeriNo" TEXT NOT NULL,
    "tezgahSaati" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "musteriIsmi" TEXT NOT NULL,
    "muhendisIsmi" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
