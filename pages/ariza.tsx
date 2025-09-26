import { useState } from "react";

export default function ArizaForm() {
  const [formData, setFormData] = useState({
    firmaIsmi: "",
    tezgahSeriNo: "",
    aciklama: "",
    musteriIsmi: "",
    musteriMail: "",
    muhendisAdi: "",
    musteriImza: "",
    teknisyenImza: "",
  });

  const [mesaj, setMesaj] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ariza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMesaj("✅ Arıza kaydı başarıyla oluşturuldu, PDF mail gönderildi.");
        setFormData({
          firmaIsmi: "",
          tezgahSeriNo: "",
          aciklama: "",
          musteriIsmi: "",
          musteriMail: "",
          muhendisAdi: "",
          musteriImza: "",
          teknisyenImza: "",
        });
      } else {
        const err = await res.json();
        setMesaj("❌ Hata: " + err.error);
      }
    } catch (error) {
      console.error(error);
      setMesaj("❌ Beklenmedik bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Arıza Kaydı</h1>
      {mesaj && <p className="mb-4">{mesaj}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firmaIsmi"
          placeholder="Firma İsmi"
          value={formData.firmaIsmi}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="tezgahSeriNo"
          placeholder="Tezgah Seri No"
          value={formData.tezgahSeriNo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="aciklama"
          placeholder="Arıza Açıklaması"
          value={formData.aciklama}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="musteriIsmi"
          placeholder="Müşteri Adı"
          value={formData.musteriIsmi}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="musteriMail"
          placeholder="Müşteri Mail"
          value={formData.musteriMail}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="muhendisAdi"
          placeholder="Mühendis Adı"
          value={formData.muhendisAdi}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="teknisyenImza"
          placeholder="Teknisyen İmza"
          value={formData.teknisyenImza}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="musteriImza"
          placeholder="Müşteri İmza"
          value={formData.musteriImza}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
