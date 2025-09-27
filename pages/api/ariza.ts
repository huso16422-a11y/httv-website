import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import getStream from "get-stream";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Yalnızca POST isteği destekleniyor.");
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

    console.log("📩 Yeni arıza kaydı alındı...");

    // Font ve logo yolları
    const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
    const logoPath = path.join(process.cwd(), "public", "logo.png");

    // PDF oluştur
    const doc = new PDFDocument({ margin: 50 });
    let buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => console.log("✅ PDF başarıyla oluşturuldu."));

    doc.registerFont("DejaVu", fontPath);

    // Logo
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 80 });
    }

    // Başlık
    doc.font("DejaVu").fontSize(20).text("⚡ ARIZA RAPORU", { align: "center" });
    doc.moveDown(2);

    // Bilgiler
    doc.fontSize(12).text(`📌 Firma İsmi: ${firmaIsmi}`);
    doc.text(`👤 Müşteri İsmi: ${musteriIsmi}`);
    doc.text(`📧 Müşteri Email: ${musteriEmail}`);
    doc.text(`🔧 Tezgah Seri No: ${tezgahSeriNo}`);
    doc.text(`👨‍🔧 Mühendis Adı: ${muhendisAdi}`);
    doc.moveDown();

    // Açıklama
    doc.fontSize(12).text("📝 Arıza Açıklaması:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(aciklama, { align: "justify" });

    doc.moveDown(2);

    // İmzalar
    const startY = doc.y;
    if (musteriImza) {
      const musteriImzaImg = musteriImza.replace(/^data:image\/png;base64,/, "");
      const musteriImzaBuffer = Buffer.from(musteriImzaImg, "base64");
      doc.image(musteriImzaBuffer, 80, startY, { width: 150, height: 70 });
      doc.text("Müşteri İmzası", 110, startY + 80);
    }

    if (muhendisImza) {
      const muhendisImzaImg = muhendisImza.replace(/^data:image\/png;base64,/, "");
      const muhendisImzaBuffer = Buffer.from(muhendisImzaImg, "base64");
      doc.image(muhendisImzaBuffer, 350, startY, { width: 150, height: 70 });
      doc.text("Mühendis İmzası", 380, startY + 80);
    }

    doc.end();
    const pdfBuffer = await getStream.buffer(doc);

    // Mail gönderimi
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"HTTV Sistem" <${process.env.EMAIL_USER}>`,
      to: [process.env.EMAIL_USER, musteriEmail],
      subject: "⚡ Yeni Arıza Kaydı",
      text: "Yeni arıza kaydı raporu ektedir.",
      attachments: [
        {
          filename: `ariza-raporu-${Date.now()}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Mail başarıyla gönderildi.");

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("❌ API Hatası:", err);
    return res.status(500).send("Sunucu hatası: " + err.message);
  }
}
