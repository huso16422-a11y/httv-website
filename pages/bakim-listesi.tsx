import { useEffect, useState } from "react";

interface Bakim {
  firmaIsmi: string;
  tezgahSeriNo: string;
  tezgahSaati: string;
  aciklama: string;
  musteriIsmi: string;
  muhendisAdi: string;
}

export default function BakimListesi() {
  const [bakimlar, setBakimlar] = useState<Bakim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBakimlar() {
      try {
        const res = await fetch("/api/bakim");
        const data = await res.json();
        if (Array.isArray(data)) {
          setBakimlar(data);
        } else {
          setBakimlar([]);
        }
      } catch (err) {
        console.error("Veri alınamadı:", err);
        setBakimlar([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBakimlar();
  }, []);

  if (loading) {
    return <p className="p-4">Yükleniyor...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bakım Listesi</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Firma İsmi</th>
            <th className="border p-2">Tezgah Seri No</th>
            <th className="border p-2">Tezgah Saati</th>
            <th className="border p-2">Açıklama</th>
            <th className="border p-2">Müşteri İsmi</th>
            <th className="border p-2">Mühendis Adı</th>
          </tr>
        </thead>
        <tbody>
          {bakimlar.length > 0 ? (
            bakimlar.map((b, index) => (
              <tr key={index}>
                <td className="border p-2">{b.firmaIsmi || "-"}</td>
                <td className="border p-2">{b.tezgahSeriNo || "-"}</td>
                <td className="border p-2">{b.tezgahSaati || "-"}</td>
                <td className="border p-2">{b.aciklama || "-"}</td>
                <td className="border p-2">{b.musteriIsmi || "-"}</td>
                <td className="border p-2">{b.muhendisAdi || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan={6}>
                Henüz bakım kaydı yok
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
