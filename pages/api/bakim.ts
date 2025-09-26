import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import getStream from "get-stream";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        firmaIsmi,
        tezgahSeriNo,
        aciklama,
        musteriAdi,
        musteriMail,
        muhendisAdi,
        musteriImza,
        teknisyenImza,
      } = req.body;

      // 1️⃣ Veritabanına kaydet
      const yeniBakim = await prisma.bakim.create({
        data: {
          firmaIsmi,
          tezgahSeriNo,
          aciklama,
          musteriAdi,
          musteriMail,
          muhendisAdi,
          musteriImza,
          teknisyenImza,
        },
      });

      console.log("✔ Bakım kaydı oluşturuldu:", yeniBakim);

      // 2️⃣ PDF oluştur
      const doc = new PDFDocument();
      const pdfBufferPromise = getStream.buffer(doc);

      doc.fontSize(20).text("Bakım Raporu", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Firma: ${firmaIsmi || "-"}`);
      doc.text(`Tezgah Seri No: ${tezgahSeriNo}`);
      doc.text(`Açıklama: ${aciklama}`);
      doc.text(`Müşteri Adı: ${musteriAdi}`);
      doc.text(`Müşteri Mail: ${musteriMail}`);
      doc.text(`Mühendis: ${muhendisAdi || "-"}`);
      doc.moveDown();
      doc.text(`Teknisyen İmzası: ${teknisyenImza || "-"}`);
      doc.text(`Müşteri İmzası: ${musteriImza || "-"}`);
      doc.end();

      const pdfBuffer = await pdfBufferPromise;

      // 3️⃣ ENV kontrolü
      console.log("EMAIL_USER:", process.env.EMAIL_USER);
      console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ var" : "❌ yok");

      // 4️⃣ Mail ayarları
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 5️⃣ Mail gönder
      const mailResult = await transporter.sendMail({
        from: `"Bakım Kayıt Sistemi" <${process.env.EMAIL_USER}>`,
        to: [musteriMail, process.env.EMAIL_USER],
        subject: "Yeni Bakım Kaydı",
        text: "Yeni bir bakım kaydı oluşturuldu. PDF raporu ekte bulabilirsiniz.",
        attachments: [
          {
            filename: "bakim_raporu.pdf",
            content: pdfBuffer,
          },
        ],
      });

      console.log("✔ Mail gönderildi:", mailResult);

      res.status(200).json({
        message: "Bakım kaydı başarıyla oluşturuldu ve mail gönderildi.",
        yeniBakim,
      });

    } catch (error: any) {
      console.error("❌ Mail/PDF Hatası:", error);
      res.status(500).json({
        error: "Bakım kaydı oluşturuldu fakat mail gönderilemedi.",
        detail: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const bakimlar = await prisma.bakim.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(bakimlar);
    } catch (error) {
      console.error("❌ Bakım listesi hatası:", error);
      res.status(500).json({ error: "Bakım kayıtları alınamadı." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
