import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function createPdf(type: "bakim" | "ariza", data: any) {
  return new Promise<string>((resolve, reject) => {
    try {
      const filePath = path.join(process.cwd(), "public", `${type}-${Date.now()}.pdf`);
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(18).text(type === "bakim" ? "🛠 CNC Bakım Raporu" : "⚠️ CNC Arıza Raporu", {
        align: "center",
      });
      doc.moveDown();

      // Ortak alanlar
      doc.fontSize(12).text(`Müşteri Adı: ${data.musteriAdi}`);
      doc.text(`Açıklama: ${data.aciklama}`);

      if (type === "bakim") {
        doc.text(`Teknisyen: ${data.teknisyenAdi}`);
      } else {
        doc.text(`Firma: ${data.firmaIsmi}`);
        doc.text(`Tezgah Seri No: ${data.tezgahSeriNo}`);
        doc.text(`Mühendis: ${data.muhendisAdi}`);
      }

      doc.text(`Tarih: ${new Date().toLocaleString("tr-TR")}`);
      doc.moveDown();

      doc.text("İmzalar:");
      doc.text(`Müşteri İmza: ${data.musteriImza || "Yok"}`);
      doc.text(`Teknisyen İmza: ${data.teknisyenImza || "Yok"}`);

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}
