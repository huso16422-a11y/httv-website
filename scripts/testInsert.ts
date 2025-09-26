import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Ariza kaydı ekle
  const ariza = await prisma.ariza.create({
    data: {
      firmaIsmi: "TestFirma",
      tezgahSeriNo: "TS-ARIZA-001",
      aciklama: "Test arıza açıklaması",
      musteriIsmi: "Ahmet Deneme",
      musteriMail: "deneme@example.com",
      muhendisAdi: "Mehmet Usta",
    },
  });
  console.log("✔ Arıza kaydı eklendi:", ariza);

  // Bakim kaydı ekle
  const bakim = await prisma.bakim.create({
    data: {
      firmaIsmi: "BakimFirma",
      tezgahSeriNo: "TS-BAKIM-001",
      aciklama: "Test bakım açıklaması",
      musteriAdi: "Ayşe Deneme",
      musteriMail: "ayse@example.com",
      muhendisAdi: "Ali Teknisyen",
    },
  });
  console.log("✔ Bakım kaydı eklendi:", bakim);
}

main()
  .catch((e) => {
    console.error("❌ Hata:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
