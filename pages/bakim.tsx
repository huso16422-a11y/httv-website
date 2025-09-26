import { useState } from "react";

export default function Bakim() {
  const [form, setForm] = useState({
    firmaIsmi: "",
    tezgahSeriNo: "",
    aciklama: "",
    musteriAdi: "",
    musteriMail: "",
    muhendisAdi: "",
    musteriImza: "",
    teknisyenImza: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/bakim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Bakım kaydı başarıyla eklendi ve mail gönderildi!");
        setForm({
          firmaIsmi: "",
          tezgahSeriNo: "",
          aciklama: "",
          musteriAdi: "",
          musteriMail: "",
          muhendisAdi: "",
          musteriImza: "",
          teknisyenImza: "",
        });
      } else {
        alert("❌ Kayıt eklenemedi.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Bakım Kaydı</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="firmaIsmi"
          placeholder="Firma İsmi"
          value={form.firmaIsmi}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="tezgahSeriNo"
          placeholder="Tezgah Seri No"
          value={form.tezgahSeriNo}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="aciklama"
          placeholder="Bakım Açıklaması"
          value={form.aciklama}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="musteriAdi"
          placeholder="Müşteri Adı"
          value={form.musteriAdi}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          name="musteriMail"
          placeholder="Müşteri Mail"
          value={form.musteriMail}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="muhendisAdi"
          placeholder="Teknisyen / Mühendis Adı"
          value={form.muhendisAdi}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="musteriImza"
          placeholder="Müşteri İmzası (metin olarak)"
          value={form.musteriImza}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="teknisyenImza"
          placeholder="Teknisyen İmzası (metin olarak)"
          value={form.teknisyenImza}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
