import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-8">Menü</h1>
      <div className="flex space-x-6">
        <Link href="/bakim">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600">
            Bakım
          </button>
        </Link>
        <Link href="/ariza">
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600">
            Arıza
          </button>
        </Link>
      </div>
    </div>
  );
}
