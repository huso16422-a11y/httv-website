"use client";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";

export default function BakimPage() {
  const teknisyenRef = useRef<SignatureCanvas>(null);
  const musteriRef = useRef<SignatureCanvas>(null);

  const [musteriAdi, setMusteriAdi] = useState("");
  const [aciklama, setAciklama] = useState("");

  const clearTeknisyen = () => teknisyenRef.current?.clear();
  const clearMusteri = () => musteriRef.current?.clear();

  const savePdf = async () => {
    if (teknisyenRef.current && musteriRef.current) {
      const teknisyen = teknisyenRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      const musteri = musteriRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      const doc = new jsPDF();

      // Logo ekle (sağ üst)
      const logo = "/logo.jpg"; // public/logo.jpg
      doc.addImage(logo, "JPEG", 150, 10, 40, 25);

      // Başlık
      doc.setFontSize(18);
      doc.text("HTTV Bakım Raporu", 20, 20);

      // Tarih
      const tarih = new Date().toLocaleDateString("tr-TR");
      doc.setFontSize(12);
      doc.text(`Tarih: ${tarih}`, 20, 35);

      // Müşteri adı
      doc.text(`Müşteri: ${musteriAdi || "Belirtilmedi"}`, 20, 45);

      // Açıklama
      doc.text("Bakım Açıklaması:", 20, 55);
      doc.text(aciklama || "—", 20, 62, { maxWidth: 170 });

      // İmzalar
      doc.text("Teknisyen İmzası:", 20, 85);
      doc.addImage(teknisyen, "PNG", 20, 90, 70, 40);

      doc.text("Müşteri İmzası:", 120, 85);
      doc.addImage(musteri, "PNG", 120, 90, 70, 40);

      // ==== Footer (gri kutu) ====
      doc.setFillColor(230, 230, 230); // gri renk
      doc.rect(0, 265, 210, 25, "F"); // sayfanın altına kutu

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text("HTTV (High Technology Tooling Velocity)", 20, 273);
      doc.text("Adres: İstanbul, Türkiye", 20, 279);
      doc.text("Tel: +90 555 123 4567  |  E-posta: info@httv.com", 20, 285);

      // Sayfa numarası (sağ alt)
      doc.text("Sayfa 1 / 1", 180, 285);

      // PDF indir
      doc.save("bakim-raporu.pdf");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Bakım İşlemi Tamamlandı</h1>
      <p className="mb-4">Lütfen müşteri bilgilerini girin ve imzaları ekleyin:</p>

      {/* Müşteri bilgileri */}
      <div className="bg-white p-6 rounded-md shadow-md mb-6 w-96">
        <label className="block mb-2 font-medium">Müşteri Adı</label>
        <input
          type="text"
          value={musteriAdi}
          onChange={(e) => setMusteriAdi(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-medium">Bakım Açıklaması</label>
        <textarea
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
        />
      </div>

      {/* Teknisyen İmza */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Teknisyen İmzası</h2>
        <SignatureCanvas
          ref={teknisyenRef}
          penColor="black"
          canvasProps={{
            className:
              "bg-white border border-gray-300 rounded-md shadow-md mb-2",
            width: 400,
            height: 200,
          }}
        />
        <button
          onClick={clearTeknisyen}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Temizle
        </button>
      </div>

      {/* Müşteri İmza */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Müşteri İmzası</h2>
        <SignatureCanvas
          ref={musteriRef}
          penColor="black"
          canvasProps={{
            className:
              "bg-white border border-gray-300 rounded-md shadow-md mb-2",
            width: 400,
            height: 200,
          }}
        />
        <button
          onClick={clearMusteri}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Temizle
        </button>
      </div>

      {/* PDF oluştur */}
      <button
        onClick={savePdf}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        PDF Raporunu Kaydet ve İndir
      </button>
    </div>
  );
}
