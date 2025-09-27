import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArizaPage() {
  const [formData, setFormData] = useState({
    firmaIsmi: "",
    tezgahSeriNo: "",
    tezgahSaati: "",
    aciklama: "",
    musteriIsmi: "",
    musteriEmail: "",
    muhendisAdi: "",
  });
  const [message, setMessage] = useState("");

  const musteriRef = useRef<any>(null);
  const muhendisRef = useRef<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearSignature = (ref: any) => {
    ref.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Gönderiliyor...");

    try {
      const musteriImza = musteriRef.current?.toDataURL("image/png");
      const muhendisImza = muhendisRef.current?.toDataURL("image/png");

      const res = await fetch("/api/ariza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, musteriImza, muhendisImza }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Arıza kaydı eklendi ve PDF gönderildi!");
        setFormData({
          firmaIsmi: "",
          tezgahSeriNo: "",
          tezgahSaati: "",
          aciklama: "",
          musteriIsmi: "",
          musteriEmail: "",
          muhendisAdi: "",
        });
        musteriRef.current?.clear();
        muhendisRef.current?.clear();
      } else {
        setMessage("❌ Hata: " + data.message);
      }
    } catch (err) {
      setMessage("❌ Sunucuya bağlanılamadı");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-700">⚡ Arıza Kaydı</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input name="firmaIsmi" value={formData.firmaIsmi} onChange={handleChange} placeholder="Firma İsmi" required />
              <Input name="tezgahSeriNo" value={formData.tezgahSeriNo} onChange={handleChange} placeholder="Tezgah Seri No" required />
              <Input name="tezgahSaati" value={formData.tezgahSaati} onChange={handleChange} placeholder="Tezgah Saati" />
              <Input name="musteriIsmi" value={formData.musteriIsmi} onChange={handleChange} placeholder="Müşteri İsmi" />
              <Input name="musteriEmail" type="email" value={formData.musteriEmail} onChange={handleChange} placeholder="Müşteri Email" />
              <Input name="muhendisAdi" value={formData.muhendisAdi} onChange={handleChange} placeholder="Mühendis Adı" />
            </div>

            <Textarea name="aciklama" value={formData.aciklama} onChange={handleChange} placeholder="Arıza Açıklaması" />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-2">🖊️ Müşteri İmzası</p>
                <SignatureCanvas ref={musteriRef} penColor="black" canvasProps={{ className: "border rounded w-full h-32" }} />
                <Button type="button" variant="destructive" size="sm" className="mt-2" onClick={() => clearSignature(musteriRef)}>Temizle</Button>
              </div>
              <div>
                <p className="font-semibold mb-2">🖊️ Mühendis İmzası</p>
                <SignatureCanvas ref={muhendisRef} penColor="black" canvasProps={{ className: "border rounded w-full h-32" }} />
                <Button type="button" variant="destructive" size="sm" className="mt-2" onClick={() => clearSignature(muhendisRef)}>Temizle</Button>
              </div>
            </div>

            <Button type="submit" className="bg-red-600 hover:bg-red-700 w-full">
              Kaydı Gönder
            </Button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
