import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Sadece POST isteği destekleniyor." });
  }

  try {
    const {
      firmaIsmi,
      musteriIsmi,
      musteriEmail,
      tezgahSeriNo,
      aciklama,
      muhendisAdi,
      musteriImza,
      muhendisImza,
    } = req.body;

    if (!musteriIsmi || !musteriEmail || !tezgahSeriNo || !aciklama || !muhendisAdi) {
      return res.status(400).json({
        message: "Eksik alanlar var.",
        data: req.body,
      });
    }

    // --- PDF oluştur ---
    const doc = new PDFDocument({ margin: 50 });
    const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath); // Türkçe karakterler için
    } else {
      doc.font("Helvetica"); // fallback
    }

    // Logo ekle (örnek: public/logo.png)
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { fit: [120, 80], align: "center" });
      doc.moveDown();
    }

    // Başlık
    doc.fontSize(18).text("📋 ARIZA RAPORU", { align: "center" });
    doc.moveDown(2);

    // İçerikler
    doc.fontSize(12).text(`Firma: ${firmaIsmi || "-"}`);
    doc.text(`Müşteri: ${musteriIsmi}`);
    doc.text(`Tezgah Seri No: ${tezgahSeriNo}`);
    doc.text(`Açıklama: ${aciklama}`);
    doc.text(`Mühendis: ${muhendisAdi}`);
    doc.moveDown(2);

    // İmzalar
    if (musteriImza) {
      const base64Data = musteriImza.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, "base64");
      doc.text("Müşteri İmzası:");
      doc.image(imgBuffer, { fit: [150, 80] });
      doc.moveDown();
    }

    if (muhendisImza) {
      const base64Data = muhendisImza.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, "base64");
      doc.text("Mühendis İmzası:");
      doc.image(imgBuffer, { fit: [150, 80] });
      doc.moveDown();
    }

    doc.end();
    const pdfBuffer = await streamToBuffer(doc);

    // --- Mail gönder ---
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Arıza Bildirimi" <${process.env.EMAIL_USER}>`,
      to: musteriEmail,
      cc: process.env.EMAIL_USER, // sana da düşüyor
      subject: "Arıza Raporu",
      text: "Arıza raporunuz ekte yer almaktadır.",
      attachments: [
        {
          filename: "ariza-raporu.pdf",
          content: pdfBuffer,
        },
      ],
    });

    return res.status(200).json({ message: "Arıza raporu başarıyla gönderildi." });
  } catch (error) {
    console.error("❌ Mail gönderim hatası:", error);
    return res.status(500).json({ message: "Mail gönderim hatası.", error });
  }
}
