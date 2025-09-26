import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

export default function PremiumLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mesaj, setMesaj] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@demo.com" && password === "123456") {
      setMesaj("✅ Giriş başarılı!");
    } else {
      setMesaj("❌ Hatalı giriş bilgileri!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a1a] via-[#0f1f3a] to-[#2ab3f0] relative overflow-hidden">
      {/* Glow efektleri */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl bg-cyan-400/50 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl bg-blue-400/50 animate-pulse" />

      {/* Watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/logo.png"
          alt="HTTV Logo"
          className="w-[420px] opacity-10 grayscale"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md px-8 py-10 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl"
      >
        {/* Logo + Başlık */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain mb-3 drop-shadow-lg"
          />
          <h1 className="text-white text-xl font-bold">HTTV Yönetim Paneli</h1>
          <p className="text-white/60 text-sm mt-1">Lütfen giriş yapın</p>
        </div>

        {mesaj && (
          <div
            className={`mb-4 p-2 rounded text-center text-sm font-medium ${
              mesaj.includes("✅")
                ? "bg-green-500/20 text-green-100"
                : "bg-red-500/20 text-red-100"
            }`}
          >
            {mesaj}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-2 top-2.5 text-white/60" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              className="w-full pl-8 pr-3 py-2 rounded-md bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-2 top-2.5 text-white/60" size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full pl-8 pr-3 py-2 rounded-md bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2 rounded-md font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg text-sm"
          >
            Giriş Yap
          </motion.button>
        </form>

        <p className="text-center text-xs text-white/50 mt-6">
          © {new Date().getFullYear()} HTTV | All rights reserved
        </p>
      </motion.div>
    </div>
  );
}
