import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, html: string, attachments: any[] = []) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Mail gönderim hatası: EMAIL_USER veya EMAIL_PASS tanımlı değil");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"HTTV Sistem" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log("📩 Mail başarıyla gönderildi:", to);
  } catch (err) {
    console.error("❌ Mail gönderilemedi:", err);
  }
}
