import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import getStream from "get-stream";
import { sendMail } from "@/lib/sendMail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { firmaIsmi, tezgahSeriNo, aciklama, musteriAdi, musteriMail, muhendisAdi } = req.body;

    // PDF oluştur
    const doc = new PDFDocument();
    doc.fontSize(18).text("Bakım Raporu", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Firma: ${firmaIsmi}`);
    doc.text(`Tezgah Seri No: ${tezgahSeriNo}`);
    doc.text(`Açıklama: ${aciklama}`);
    doc.text(`Müşteri Adı: ${musteriAdi}`);
    doc.text(`Müşteri Mail: ${musteriMail}`);
    doc.text(`Mühendis Adı: ${muhendisAdi}`);
    doc.end();

    const pdfBuffer = await getStream.buffer(doc);

    // 1️⃣ Müşteriye gönder
    await sendMail(
      musteriMail,
      "Bakım Raporu",
      "<p>Bakım raporunuz ektedir.</p>",
      [{ filename: "bakim-raporu.pdf", content: pdfBuffer }]
    );

    // 2️⃣ Sana gönder
    await sendMail(
      process.env.EMAIL_USER!,
      "Bakım Raporu (Kopya)",
      `<p>${musteriAdi} için oluşturulan bakım raporu ektedir.</p>`,
      [{ filename: "bakim-raporu.pdf", content: pdfBuffer }]
    );

    res.status(200).json({ message: "Mail başarıyla gönderildi" });
  } catch (error: any) {
    console.error("Bakım mail gönderim hatası:", error);
    res.status(500).json({ error: "Mail gönderilemedi", details: error.message });
  }
}
