import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@demo.com" && password === "1234") {
      alert("✅ Giriş başarılı!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      alert("❌ Geçersiz kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
        {/* Logo */}
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="HTTV Logo"
            className="mx-auto mb-4 h-16 w-16 drop-shadow-md"
          />
          <h1 className="text-3xl font-extrabold text-gray-800">
            HTTV Yönetim Paneli
          </h1>
          <p className="text-gray-600">Lütfen giriş yapın</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="admin@demo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white shadow-md transition duration-300 hover:scale-[1.02] hover:bg-indigo-700"
          >
            Giriş Yap
          </button>
        </form>

        {/* Alt bilgi */}
        <p className="mt-8 text-center text-sm text-gray-500">
          © 2025 HTTV | Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
