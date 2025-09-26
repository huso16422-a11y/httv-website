import { useEffect, useState } from "react";

type Ariza = {
  id: number;
  firmaIsmi: string;
  tezgahSeriNo: string;
  aciklama: string;
  musteriIsmi: string;
  muhendisAdi: string;
  musteriImza: string | null;
  teknisyenImza: string | null;
  createdAt: string;
};

export default function ArizaListesi() {
  const [arizalar, setArizalar] = useState<Ariza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ariza")
      .then((res) => res.json())
      .then((data) => {
        setArizalar(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">⏳ Yükleniyor...</p>;

  if (arizalar.length === 0) {
    return <p className="p-6">Henüz arıza kaydı yok.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Arıza Kayıtları</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Firma</th>
            <th className="border px-3 py-2">Tezgah Seri No</th>
            <th className="border px-3 py-2">Açıklama</th>
            <th className="border px-3 py-2">Müşteri Adı</th>
            <th className="border px-3 py-2">Mühendis</th>
            <th className="border px-3 py-2">Müşteri İmzası</th>
            <th className="border px-3 py-2">Teknisyen İmzası</th>
            <th className="border px-3 py-2">Tarih</th>
          </tr>
        </thead>
        <tbody>
          {arizalar.map((a) => (
            <tr key={a.id}>
              <td className="border px-3 py-2">{a.id}</td>
              <td className="border px-3 py-2">{a.firmaIsmi}</td>
              <td className="border px-3 py-2">{a.tezgahSeriNo}</td>
              <td className="border px-3 py-2">{a.aciklama}</td>
              <td className="border px-3 py-2">{a.musteriIsmi}</td>
              <td className="border px-3 py-2">{a.muhendisAdi}</td>
              <td className="border px-3 py-2">{a.musteriImza || "-"}</td>
              <td className="border px-3 py-2">{a.teknisyenImza || "-"}</td>
              <td className="border px-3 py-2">
                {new Date(a.createdAt).toLocaleString("tr-TR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
