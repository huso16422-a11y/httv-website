import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export default function Bakim() {
  const [formData, setFormData] = useState({
    firmaIsmi: "",
    tezgahSeriNo: "",
    tezgahSaati: "",
    aciklama: "",
    musteriIsmi: "",
    musteriMail: "",
    muhendisAdi: "",
  });

  const [message, setMessage] = useState("");
  const musteriImzaRef = useRef<SignatureCanvas>(null);
  const muhendisImzaRef = useRef<SignatureCanvas>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearImza = (ref: React.RefObject<SignatureCanvas>) => {
    ref.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Kaydediliyor...");

    const musteriImza = musteriImzaRef.current?.toDataURL() || "";
    const muhendisImza = muhendisImzaRef.current?.toDataURL() || "";

    const response = await fetch("/api/bakim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, musteriImza, muhendisImza }),
    });

    if (response.ok) {
      setMessage("✅ Bakım kaydı eklendi ve mail gönderildi!");
      setFormData({
        firmaIsmi: "",
        tezgahSeriNo: "",
        tezgahSaati: "",
        aciklama: "",
        musteriIsmi: "",
        musteriMail: "",
        muhendisAdi: "",
      });
      musteriImzaRef.current?.clear();
      muhendisImzaRef.current?.clear();
    } else {
      setMessage("❌ Hata: " + (await response.text()));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-700">
            🛠️ Bakım Kaydı Formu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Firma İsmi"
                name="firmaIsmi"
                value={formData.firmaIsmi}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Tezgah Seri No"
                name="tezgahSeriNo"
                value={formData.tezgahSeriNo}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Tezgah Saati"
                name="tezgahSaati"
                value={formData.tezgahSaati}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Müşteri İsmi"
                name="musteriIsmi"
                value={formData.musteriIsmi}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                placeholder="Müşteri Mail"
                name="musteriMail"
                value={formData.musteriMail}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Mühendis Adı"
                name="muhendisAdi"
                value={formData.muhendisAdi}
                onChange={handleChange}
                required
              />
            </div>

            <Textarea
              placeholder="Açıklama"
              name="aciklama"
              value={formData.aciklama}
              onChange={handleChange}
              required
              className="h-24"
            />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="font-medium">Müşteri İmzası</label>
                <SignatureCanvas
                  ref={musteriImzaRef}
                  canvasProps={{ className: "border w-full h-40 rounded" }}
                />
                <Button
                  type="button"
                  onClick={() => clearImza(musteriImzaRef)}
                  className="mt-2 bg-red-500 text-white"
                >
                  Temizle
                </Button>
              </div>
              <div>
                <label className="font-medium">Mühendis İmzası</label>
                <SignatureCanvas
                  ref={muhendisImzaRef}
                  canvasProps={{ className: "border w-full h-40 rounded" }}
                />
                <Button
                  type="button"
                  onClick={() => clearImza(muhendisImzaRef)}
                  className="mt-2 bg-red-500 text-white"
                >
                  Temizle
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white font-semibold">
              Kaydet
            </Button>
          </form>
          {message && <p className="mt-6 text-center font-medium text-gray-700">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
