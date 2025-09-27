import { useEffect, useState } from "react";

interface Ariza {
  tezgahSeriNo: string;
  arizaAciklama: string;
  musteriIsmi: string;
  muhendisAdi: string;
}

export default function ArizaListesi() {
  const [arizalar, setArizalar] = useState<Ariza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArizalar() {
      try {
        const res = await fetch("/api/ariza");
        const data = await res.json();
        if (Array.isArray(data)) {
          setArizalar(data);
        } else {
          setArizalar([]);
        }
      } catch (err) {
        console.error("Veri alınamadı:", err);
        setArizalar([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArizalar();
  }, []);

  if (loading) {
    return <p className="p-4">Yükleniyor...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Arıza Listesi</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tezgah Seri No</th>
            <th className="border p-2">Arıza Açıklama</th>
            <th className="border p-2">Müşteri İsmi</th>
            <th className="border p-2">Mühendis Adı</th>
          </tr>
        </thead>
        <tbody>
          {arizalar.length > 0 ? (
            arizalar.map((a, index) => (
              <tr key={index}>
                <td className="border p-2">{a.tezgahSeriNo || "-"}</td>
                <td className="border p-2">{a.arizaAciklama || "-"}</td>
                <td className="border p-2">{a.musteriIsmi || "-"}</td>
                <td className="border p-2">{a.muhendisAdi || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan={4}>
                Henüz arıza kaydı yok
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
