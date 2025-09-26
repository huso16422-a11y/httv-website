import nodemailer from "nodemailer";

export async function sendMail(
  to: string | string[],
  subject: string,
  html: string,
  attachments: any[] = []
) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.me.com", // iCloud SMTP
      port: 587,
      secure: false,
      auth: {
        user: process.env.ICLOUD_USER, // .env dosyanda olacak
        pass: process.env.ICLOUD_PASS, // app-specific password
      },
    });

    const mailOptions = {
      from: `"Bakım & Arıza Takip" <${process.env.ICLOUD_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Mail gönderildi:", to);
  } catch (error) {
    console.error("❌ Mail gönderilemedi:", error);
    throw error;
  }
}
