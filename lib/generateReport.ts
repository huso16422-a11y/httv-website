import PDFDocument from "pdfkit";
import getStream from "get-stream";

interface ReportData {
  title: string;
  firmaIsmi: string;
  tezgahSeriNo: string;
  aciklama: string;
  musteriAdi: string;
  musteriMail: string;
  muhendisAdi: string;
}

export async function generateReport(data: ReportData): Promise<Buffer> {
  const doc = new PDFDocument();
  const stream = doc.pipe(getStream.buffer());

  // Başlık
  doc.fontSize(20).text(data.title, { align: "center" });
  doc.moveDown();

  // Bilgiler
  doc.fontSize(12).text(`Firma: ${data.firmaIsmi}`);
  doc.text(`Tezgah Seri No: ${data.tezgahSeriNo}`);
  doc.text(`Açıklama: ${data.aciklama}`);
  doc.text(`Müşteri Adı: ${data.musteriAdi}`);
  doc.text(`Müşteri Mail: ${data.musteriMail}`);
  doc.text(`Mühendis Adı: ${data.muhendisAdi}`);
  doc.moveDown();

  // Alt kısım
  doc.text("HTTV Otomatik Raporlama Sistemi", { align: "center" });

  doc.end();
  return stream;
}
