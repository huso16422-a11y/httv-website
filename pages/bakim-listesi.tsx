import { useEffect, useState } from "react";

interface Bakim {
  firmaAdi: string;
  tezgahSeriNo: string;
  tezgahSaati: string;
  isTanimi: string;
  musteriAdi: string;
  muhendisAdi: string;
}

export default function BakimListesi() {
  const [kayitlar, setKayitlar] = useState<Bakim[]>([]);

  useEffect(() => {
    const fetchKayitlar = async () => {
      try {
        const res = await fetch("/api/bakim");
        if (res.ok) {
          const data = await res.json();
          setKayitlar(data);
        }
      } catch (error) {
        console.error("Kayıtlar alınamadı:", error);
      }
    };

    fetchKayitlar();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bakım Kayıtları</h1>
      {kayitlar.length === 0 ? (
        <p>Henüz kayıt yok.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Firma Adı</th>
              <th className="border px-4 py-2">Tezgah Seri No</th>
              <th className="border px-4 py-2">Tezgah Saati</th>
              <th className="border px-4 py-2">İş Tanımı</th>
              <th className="border px-4 py-2">Müşteri Adı</th>
              <th className="border px-4 py-2">Mühendis Adı</th>
            </tr>
          </thead>
          <tbody>
            {kayitlar.map((kayit, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{kayit.firmaAdi}</td>
                <td className="border px-4 py-2">{kayit.tezgahSeriNo}</td>
                <td className="border px-4 py-2">{kayit.tezgahSaati}</td>
                <td className="border px-4 py-2">{kayit.isTanimi}</td>
                <td className="border px-4 py-2">{kayit.musteriAdi}</td>
                <td className="border px-4 py-2">{kayit.muhendisAdi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
