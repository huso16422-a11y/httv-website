import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";

export default function ImzaPage() {
  const musteriRef = useRef<SignatureCanvas>(null);
  const teknisyenRef = useRef<SignatureCanvas>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Örnek bakım raporu verileri
  const raporBilgileri = {
    musteriAdi: "Ahmet Yılmaz",
    firma: "XYZ Makina",
    cihaz: "Endüstriyel Kompresör",
    yapilanIslem: "Bakım yapıldı, filtre değiştirildi, yağ seviyesi kontrol edildi.",
    tarih: new Date().toLocaleDateString("tr-TR"),
    teknisyen: "Mehmet Demir",
  };

  const handleClear = (type: "musteri" | "teknisyen") => {
    if (type === "musteri") musteriRef.current?.clear();
    if (type === "teknisyen") teknisyenRef.current?.clear();
  };

  const handleSubmit = () => {
    if (musteriRef.current?.isEmpty() || teknisyenRef.current?.isEmpty()) {
      setMessage("⚠️ Lütfen müşteri ve teknisyen imzalarını ekleyin.");
      return;
    }

    const musteriImza = musteriRef.current?.toDataURL("image/png");
    const teknisyenImza = teknisyenRef.current?.toDataURL("image/png");

    // PDF oluşturma
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("📝 Bakım Raporu", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Müşteri Adı: ${raporBilgileri.musteriAdi}`, 20, 40);
    pdf.text(`Firma: ${raporBilgileri.firma}`, 20, 50);
    pdf.text(`Cihaz: ${raporBilgileri.cihaz}`, 20, 60);
    pdf.text("Yapılan İşlem:", 20, 75);

    // İşlem açıklaması satırlara bölünüyor
    const splitText = pdf.splitTextToSize(raporBilgileri.yapilanIslem, 170);
    pdf.text(splitText, 20, 85);

    pdf.text(`Tarih: ${raporBilgileri.tarih}`, 20, 120);
    pdf.text(`Teknisyen: ${raporBilgileri.teknisyen}`, 20, 130);

    // Müşteri imzası
    pdf.text("Müşteri İmzası:", 20, 150);
    if (musteriImza) {
      pdf.addImage(musteriImza, "PNG", 20, 155, 60, 40);
    }

    // Teknisyen imzası
    pdf.text("Teknisyen İmzası:", 120, 150);
    if (teknisyenImza) {
      pdf.addImage(teknisyenImza, "PNG", 120, 155, 60, 40);
    }

    pdf.save("bakim_raporu.pdf");

    setMessage("✅ Rapor başarıyla oluşturuldu ve PDF indirildi!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          İmza Onay Ekranı
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Lütfen müşteri ve teknisyen imzalarını ekleyiniz.
        </p>

        {/* İmza Alanları */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Müşteri */}
          <div>
            <h2 className="font-semibold mb-2">🧑‍💼 Müşteri İmzası</h2>
            <SignatureCanvas
              ref={musteriRef}
              penColor="black"
              canvasProps={{ className: "border w-full h-48 rounded-lg" }}
            />
            <button
              onClick={() => handleClear("musteri")}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Temizle
            </button>
          </div>

          {/* Teknisyen */}
          <div>
            <h2 className="font-semibold mb-2">🔧 Teknisyen İmzası</h2>
            <SignatureCanvas
              ref={teknisyenRef}
              penColor="black"
              canvasProps={{ className: "border w-full h-48 rounded-lg" }}
            />
            <button
              onClick={() => handleClear("teknisyen")}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <button
          onClick={handleSubmit}
          className="w-full mt-10 bg-blue-600 text-white p-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
        >
          ✅ Onayla ve PDF İndir
        </button>

        {/* Mesaj */}
        {message && (
          <div className="mt-6 text-center text-lg font-medium text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
