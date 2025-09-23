import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

type BakimKaydi = {
  firmaIsmi: string;
  tezgahSeriNo: string;
  tezgahSaati: string;
  aciklama: string;
  musteriIsmi: string;
  muhendisAdi: string;
};

const dosyaYolu = path.join(process.cwd(), "bakim.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const yeniKayit: BakimKaydi = req.body;

    // Eski kayıtları oku
    let kayitlar: BakimKaydi[] = [];
    if (fs.existsSync(dosyaYolu)) {
      const data = fs.readFileSync(dosyaYolu, "utf-8");
      kayitlar = JSON.parse(data);
    }

    // Yeni kaydı ekle
    kayitlar.push(yeniKayit);

    // Dosyaya yaz
    fs.writeFileSync(dosyaYolu, JSON.stringify(kayitlar, null, 2));

    res.status(200).json({ message: "Kayıt eklendi", kayit: yeniKayit });
  } else if (req.method === "GET") {
    if (fs.existsSync(dosyaYolu)) {
      const data = fs.readFileSync(dosyaYolu, "utf-8");
      const kayitlar = JSON.parse(data);
      res.status(200).json(kayitlar);
    } else {
      res.status(200).json([]);
    }
  } else {
    res.status(405).json({ message: "Yalnızca GET ve POST kullanılabilir" });
  }
}
