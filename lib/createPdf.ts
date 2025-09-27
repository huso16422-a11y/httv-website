import PDFDocument from "pdfkit";
import getStream from "get-stream";
import path from "path";

export async function createPdf(data: {
  type: "bakim" | "ariza";
  firmaIsmi: string;
  musteriIsmi: string;
  musteriEmail: string;
  tezgahSeriNo: string;
  tezgahSaati?: string;
  aciklama: string;
  muhendisAdi: string;
}) {
  const doc = new PDFDocument({ margin: 50 });
  const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
  doc.font(fontPath);

  // Logo
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  try {
    doc.image(logoPath, 50, 30, { width: 100 });
  } catch (err) {
    console.warn("⚠️ Logo yüklenemedi:", err);
  }

  // Başlık
  doc.fontSize(20).text(
    data.type === "bakim" ? "🛠️ BAKIM RAPORU" : "⚡ ARIZA RAPORU",
    { align: "center" }
  );
  doc.moveDown(2);

  // Bilgi Alanları
  const info: [string, string][] = [
    ["Firma İsmi", data.firmaIsmi],
    ["Müşteri İsmi", data.musteriIsmi],
    ["Müşteri Mail", data.musteriEmail],
    ["Tezgah Seri No", data.tezgahSeriNo],
    ["Tezgah Saati", data.tezgahSaati || "-"],
    ["Açıklama", data.aciklama],
    ["Mühendis Adı", data.muhendisAdi],
  ];

  info.forEach(([label, value]) => {
    doc.fontSize(12).text(`${label}:`, { continued: true, width: 150 });
    doc.font("Helvetica-Bold").text(` ${value}`);
    doc.font(fontPath);
    doc.moveDown(0.5);
  });

  doc.moveDown(2);

  // İmza Alanları
  doc.fontSize(14).text("Onaylar", { align: "center" });
  doc.moveDown(1);

  const startY = doc.y;
  doc.rect(70, startY, 200, 80).stroke();
  doc.text("Müşteri İmzası", 90, startY + 85);

  doc.rect(330, startY, 200, 80).stroke();
  doc.text("Mühendis İmzası", 350, startY + 85);

  doc.moveDown(6);

  // Alt bilgi
  doc.fontSize(10).fillColor("gray").text(
    "HTTV Mühendislik © 2025 | İletişim: info@httv.com | www.httv.com",
    { align: "center" }
  );

  doc.end();
  return await getStream.buffer(doc);
}
