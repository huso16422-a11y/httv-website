import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "ariza.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const yeniKayit = req.body;

    // Eski kayıtları oku
    let mevcutKayitlar = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      mevcutKayitlar = JSON.parse(fileData || "[]");
    }

    // Yeni kaydı ekle
    mevcutKayitlar.push(yeniKayit);

    // JSON dosyasına yaz
    fs.writeFileSync(filePath, JSON.stringify(mevcutKayitlar, null, 2));

    res.status(200).json({ success: true, data: yeniKayit });
  } else if (req.method === "GET") {
    // JSON dosyasını oku
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      const kayitlar = JSON.parse(fileData || "[]");
      res.status(200).json(kayitlar);
    } else {
      res.status(200).json([]);
    }
  } else {
    res.status(405).json({ message: "Yalnızca GET ve POST destekleniyor" });
  }
}
