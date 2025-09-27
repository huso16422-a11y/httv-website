import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      firmaIsmi,
      tezgahSeriNo,
      tezgahSaati,
      aciklama,
      musteriIsmi,
      muhendisAdi,
      musteriImza,
      muhendisImza,
    } = req.body;

    console.log("📩 Yeni bakım kaydı alındı...");
    console.log("📄 Profesyonel PDF oluşturuluyor...");

    const doc = new PDFDocument({ margin: 50 });
    let buffers: any[] = [];
    doc.on("data", buffers.push.bind(buffers));
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
    });

    // ✅ Türkçe font
    doc.registerFont("DejaVu", process.cwd() + "/public/fonts/DejaVuSans.ttf");

    // === HEADER ===
    try {
      doc.image(process.cwd() + "/public/logo.png", 50, 20, { width: 100 });
    } catch {
      console.log("⚠️ Logo yüklenemedi.");
    }

    doc.font("DejaVu").fontSize(18).fillColor("#1f2937").text("BAKIM RAPORU", 0, 40, {
      align: "center",
    });

    doc.moveDown(2);

    // === RAPOR BİLGİLERİ ===
    const now = new Date();
    const tarih = now.toLocaleDateString("tr-TR");
    const raporNo = "BR-" + now.getTime();

    doc.font("DejaVu").fontSize(12).fillColor("black");

    const infoData = [
      ["📌 Firma İsmi", firmaIsmi],
      ["🔢 Tezgah Seri No", tezgahSeriNo],
      ["⏱️ Tezgah Saati", tezgahSaati],
      ["👤 Müşteri İsmi", musteriIsmi],
      ["👨‍🔧 Mühendis Adı", muhendisAdi],
      ["📅 Tarih", tarih],
      ["🆔 Rapor No", raporNo],
    ];

    // tablo gibi hizala
    infoData.forEach(([label, value]) => {
      doc.font("DejaVu").fontSize(12).text(`${label}:`, { continued: true, width: 150 });
      doc.font("DejaVu").fontSize(12).fillColor("#374151").text(` ${value}`);
    });

    doc.moveDown(1.5);

    // === AÇIKLAMA ===
    doc.font("DejaVu").fontSize(12).fillColor("black").text("📝 Açıklama", {
      underline: true,
    });
    doc.moveDown(0.5);

    doc.rect(50, doc.y, 500, 80).stroke();
    doc.text(aciklama, 55, doc.y + 5, { width: 480, align: "left" });
    doc.moveDown(6);

    // === İMZALAR ===
    doc.font("DejaVu").fontSize(12).fillColor("black").text("Onaylar", {
      underline: true,
    });
    doc.moveDown(1);

    if (musteriImza) {
      const musteriImg = Buffer.from(musteriImza.split(",")[1], "base64");
      doc.rect(50, doc.y, 200, 80).stroke();
      doc.text("Müşteri İmzası", 55, doc.y - 15);
      doc.image(musteriImg, 60, doc.y, { fit: [180, 60] });
    }

    if (muhendisImza) {
      const muhendisImg = Buffer.from(muhendisImza.split(",")[1], "base64");
      doc.rect(350, doc.y, 200, 80).stroke();
      doc.text("Mühendis İmzası", 355, doc.y - 15);
      doc.image(muhendisImg, 360, doc.y, { fit: [180, 60] });
    }

    doc.end();
    const pdfBuffer = await pdfPromise;

    console.log("✅ Profesyonel PDF başarıyla oluşturuldu.");

    // === MAIL ===
    console.log("📡 Mail server’a bağlanılıyor...");
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bakım Sistemi" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Buraya kendi mailini yaz
      subject: "Yeni Bakım Raporu",
      text: "Yeni bakım kaydı eklendi. PDF ektedir.",
      attachments: [
        {
          filename: `${raporNo}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log("✅ Mail başarıyla gönderildi.");

    return res.status(200).json({ message: "Bakım kaydı eklendi ve mail gönderildi!" });
  } catch (error) {
    console.error("❌ API Hatası:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
