import { NextApiRequest, NextApiResponse } from "next";
import { sendMail } from "@/lib/sendMail";
import { generateReport } from "@/lib/generateReport";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { firmaIsmi, tezgahSeriNo, aciklama, musteriIsmi, musteriMail, muhendisAdi } = req.body;

    const pdfBuffer = await generateReport({
      title: "Arıza Raporu",
      firmaIsmi,
      tezgahSeriNo,
      aciklama,
      musteriAdi: musteriIsmi,
      musteriMail,
      muhendisAdi,
    });

    // Müşteriye
    await sendMail(musteriMail, "Arıza Raporu", "<p>Arıza raporunuz ektedir.</p>", [
      { filename: "ariza-raporu.pdf", content: pdfBuffer },
    ]);

    // Sana
    await sendMail(process.env.EMAIL_USER!, "Arıza Raporu (Kopya)", "<p>Arıza raporu ektedir.</p>", [
      { filename: "ariza-raporu.pdf", content: pdfBuffer },
    ]);

    res.status(200).json({ message: "Mail başarıyla gönderildi" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
