import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Yalnızca POST istekleri desteklenir" });
  }

  try {
    const {
      firmaIsmi,
      tezgahSeriNo,
      musteriAdi,
      musteriMail,
      aciklama,
      muhendisAdi,
      musteriImza,
      muhendisImza,
    } = req.body;

    if (!firmaIsmi || !tezgahSeriNo || !musteriAdi || !musteriMail || !aciklama || !muhendisAdi) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır." });
    }

    // PDF oluştur (tek sayfa)
    const pdfDoc = new PDFDocument({ size: "A4" });
    const buffers: Buffer[] = [];

    pdfDoc.on("data", (chunk) => buffers.push(chunk));
    pdfDoc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Mail transporter (iCloud SMTP)
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: [process.env.EMAIL_USER, musteriMail],
        subject: `Bakım Raporu - ${firmaIsmi}`,
        text: "Bakım raporunuz ektedir.",
        attachments: [
          {
            filename: `bakim-raporu-${Date.now()}.pdf`,
            content: pdfBuffer,
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Mail gönderildi");
        return res.status(200).json({ message: "Bakım raporu başarıyla gönderildi." });
      } catch (error) {
        console.error("📧 Mail gönderim hatası:", error);
        return res.status(500).json({ message: "Mail gönderilirken hata oluştu.", error });
      }
    });

    // ---- PDF İÇERİĞİ ----

    // Türkçe font ekle
    const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
    if (fs.existsSync(fontPath)) {
      pdfDoc.font(fontPath);
    } else {
      pdfDoc.font("Helvetica"); // fallback
    }

    // Logo ekle (sayfa üstüne)
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      pdfDoc.image(logoPath, 50, 30, { width: 100 });
    }

    pdfDoc.moveDown(4).fontSize(18).text("🛠️ Bakım Raporu", { align: "center" }).moveDown();

    pdfDoc.fontSize(12).text(`Firma: ${firmaIsmi}`);
    pdfDoc.text(`Tezgah Seri No: ${tezgahSeriNo}`);
    pdfDoc.text(`Müşteri: ${musteriAdi}`);
    pdfDoc.text(`Teknisyen: ${muhendisAdi}`);
    pdfDoc.moveDown().text(`Açıklama: ${aciklama}`);

    // İmzalar aynı sayfada olacak
    pdfDoc.moveDown(2).text("Müşteri İmzası:", { underline: true });
    if (musteriImza) {
      const img = musteriImza.replace(/^data:image\/png;base64,/, "");
      pdfDoc.image(Buffer.from(img, "base64"), { fit: [150, 60] });
    }

    pdfDoc.moveDown(2).text("Teknisyen İmzası:", { underline: true });
    if (muhendisImza) {
      const img = muhendisImza.replace(/^data:image\/png;base64,/, "");
      pdfDoc.image(Buffer.from(img, "base64"), { fit: [150, 60] });
    }

    pdfDoc.end();
  } catch (error) {
    console.error("❌ Genel hata:", error);
    return res.status(500).json({ message: "Sunucu hatası", error });
  }
}
