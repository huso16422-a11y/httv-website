import { useEffect, useState } from "react";

type Bakim = {
  id: number;
  musteriAdi: string;
  aciklama: string;
  musteriImza: string | null;
  teknisyenImza: string | null;
  createdAt: string;
};

export default function BakimListesi() {
  const [bakimlar, setBakimlar] = useState<Bakim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bakim")
      .then((res) => res.json())
      .then((data) => {
        setBakimlar(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">⏳ Yükleniyor...</p>;

  if (bakimlar.length === 0) {
    return <p className="p-6">Henüz bakım kaydı yok.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bakım Kayıtları</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Müşteri Adı</th>
            <th className="border px-3 py-2">Açıklama</th>
            <th className="border px-3 py-2">Müşteri İmzası</th>
            <th className="border px-3 py-2">Teknisyen İmzası</th>
            <th className="border px-3 py-2">Tarih</th>
          </tr>
        </thead>
        <tbody>
          {bakimlar.map((b) => (
            <tr key={b.id}>
              <td className="border px-3 py-2">{b.id}</td>
              <td className="border px-3 py-2">{b.musteriAdi}</td>
              <td className="border px-3 py-2">{b.aciklama}</td>
              <td className="border px-3 py-2">{b.musteriImza || "-"}</td>
              <td className="border px-3 py-2">{b.teknisyenImza || "-"}</td>
              <td className="border px-3 py-2">
                {new Date(b.createdAt).toLocaleString("tr-TR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
