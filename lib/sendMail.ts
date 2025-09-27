import nodemailer from "nodemailer";

export async function sendMail(
  to: string,
  subject: string,
  html: string,
  attachments: any[] = []
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mail.me.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // iCloud için TLS => secure: false olmalı
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  });

  console.log("✅ Mail gönderildi:", info.messageId);
  return info;
}
