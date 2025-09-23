import { useState, useEffect } from "react";

export default function Ariza() {
  const [musteriAdi, setMusteriAdi] = useState("");
  const [tezgahSeriNo, setTezgahSeriNo] = useState("");
  const [arizaTanimi, setArizaTanimi] = useState("");
  const [cozum, setCozum] = useState("");
  const [kayitlar, setKayitlar] = useState<any[]>([]);

  // Kayıtları JSON’dan al
  useEffect(() => {
    fetch("/api/ariza")
      .then((res) => res.json())
      .then((data) => setKayitlar(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const yeniKayit = {
      musteriAdi,
      tezgahSeriNo,
      arizaTanimi,
      cozum,
      tarih: new Date().toLocaleString(),
    };

    const res = await fetch("/api/ariza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(yeniKayit),
    });

    if (res.ok) {
      setKayitlar([...kayitlar, yeniKayit]);
      setMusteriAdi("");
      setTezgahSeriNo("");
      setArizaTanimi("");
      setCozum("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Arıza Kaydı</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium">Müşteri Adı</label>
          <input
            type="text"
            value={musteriAdi}
            onChange={(e) => setMusteriAdi(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tezgah Seri No</label>
          <input
            type="text"
            value={tezgahSeriNo}
            onChange={(e) => setTezgahSeriNo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Arıza Tanımı</label>
          <textarea
            value={arizaTanimi}
            onChange={(e) => setArizaTanimi(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Çözüm</label>
          <textarea
            value={cozum}
            onChange={(e) => setCozum(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
          Kaydet
        </button>
      </form>

      {/* Kayıtları Listele */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Arıza Kayıtları</h2>
        <ul className="space-y-2">
          {kayitlar.map((k, i) => (
            <li key={i} className="p-4 border rounded bg-gray-50">
              <p><strong>Müşteri:</strong> {k.musteriAdi}</p>
              <p><strong>Tezgah Seri No:</strong> {k.tezgahSeriNo}</p>
              <p><strong>Arıza:</strong> {k.arizaTanimi}</p>
              <p><strong>Çözüm:</strong> {k.cozum}</p>
              <p className="text-sm text-gray-500"><strong>Tarih:</strong> {k.tarih}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
