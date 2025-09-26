import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-700 text-white">
      <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
        HTTV Yönetim Sistemi
      </h1>
      <p className="text-lg mb-8 text-white/90">
        Bakım ve Arıza Takip Platformuna Hoş Geldiniz
      </p>

      <Link
        href="/login"
        className="px-8 py-3 rounded-xl font-semibold bg-white text-blue-600 shadow-lg hover:bg-gray-100 transition"
      >
        🚀 Giriş Yap
      </Link>
    </div>
  );
}
