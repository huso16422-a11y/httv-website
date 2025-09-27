import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArizaForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const musteriImzaRef = useRef<SignatureCanvas>(null);
  const muhendisImzaRef = useRef<SignatureCanvas>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = {
      firmaIsmi: (form.firmaIsmi as any).value,
      musteriIsmi: (form.musteriIsmi as any).value,
      musteriEmail: (form.musteriEmail as any).value,
      tezgahSeriNo: (form.tezgahSeriNo as any).value,
      aciklama: (form.aciklama as any).value,
      muhendisAdi: (form.muhendisAdi as any).value,
      musteriImza: musteriImzaRef.current?.getCanvas().toDataURL(),
      muhendisImza: muhendisImzaRef.current?.getCanvas().toDataURL(),
    };

    try {
      const res = await fetch("/api/ariza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ Arıza kaydı oluşturuldu ve mail gönderildi.");
        form.reset();
        musteriImzaRef.current?.clear();
        muhendisImzaRef.current?.clear();
      } else {
        setMessage("❌ Hata: " + (await res.text()));
      }
    } catch (err) {
      setMessage("❌ Hata: Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-700">
            ⚡ Arıza Kaydı Formu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="firmaIsmi" placeholder="Firma İsmi" required />
            <Input name="musteriIsmi" placeholder="Müşteri İsmi" required />
            <Input
              name="musteriEmail"
              type="email"
              placeholder="Müşteri E-mail"
              required
            />
            <Input name="tezgahSeriNo" placeholder="Tezgah Seri No" required />
            <Textarea name="aciklama" placeholder="Arıza Açıklaması" required />
            <Input name="muhendisAdi" placeholder="Mühendis Adı" required />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-1">Müşteri İmzası</p>
                <SignatureCanvas
                  ref={musteriImzaRef}
                  penColor="black"
                  canvasProps={{
                    width: 250,
                    height: 100,
                    className: "border border-gray-400 rounded",
                  }}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Mühendis İmzası</p>
                <SignatureCanvas
                  ref={muhendisImzaRef}
                  penColor="black"
                  canvasProps={{
                    width: 250,
                    height: 100,
                    className: "border border-gray-400 rounded",
                  }}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Gönderiliyor..." : "Kaydet"}
            </Button>
          </form>
          {message && (
            <p className="mt-4 text-center font-medium text-sm">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
