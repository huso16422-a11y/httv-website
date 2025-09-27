import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BakimForm() {
  const [loading, setLoading] = useState(false);
  const musteriImzaRef = useRef<SignatureCanvas>(null);
  const muhendisImzaRef = useRef<SignatureCanvas>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const formData = {
      firmaIsmi: (form.firmaIsmi as any).value,
      tezgahSeriNo: (form.tezgahSeriNo as any).value,
      musteriAdi: (form.musteriAdi as any).value,
      musteriMail: (form.musteriMail as any).value,
      aciklama: (form.aciklama as any).value,
      muhendisAdi: (form.muhendisAdi as any).value,
      musteriImza: musteriImzaRef.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png"),
      muhendisImza: muhendisImzaRef.current
        ?.getTrimmedCanvas()
        .toDataURL("image/png"),
    };

    try {
      const response = await fetch("/api/bakim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Bakım PDF raporu başarıyla gönderildi!");
        form.reset();
        musteriImzaRef.current?.clear();
        muhendisImzaRef.current?.clear();
      } else {
        alert("❌ Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Sunucuya ulaşılamadı!");
    } finally {
      setLoading(false); // 🔑 burada buton state sıfırlanıyor
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="firmaIsmi" placeholder="Firma İsmi" required />
            <Input name="tezgahSeriNo" placeholder="Tezgah Seri No" required />
            <Input name="musteriAdi" placeholder="Müşteri Adı" required />
            <Input
              name="musteriMail"
              type="email"
              placeholder="Müşteri E-mail"
              required
            />
            <Input name="muhendisAdi" placeholder="Teknisyen Adı" required />
            <Textarea name="aciklama" placeholder="Bakım Açıklaması" required />

            <div>
              <p className="font-semibold">🖊️ Müşteri İmzası</p>
              <SignatureCanvas
                ref={musteriImzaRef}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 150,
                  className: "border border-gray-300 rounded",
                }}
              />
            </div>

            <div>
              <p className="font-semibold">🖊️ Teknisyen İmzası</p>
              <SignatureCanvas
                ref={muhendisImzaRef}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 150,
                  className: "border border-gray-300 rounded",
                }}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Gönderiliyor..." : "Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
