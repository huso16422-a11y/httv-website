import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>HTTV Ana Sayfa</h1>
      <p>Hoş geldiniz! Lütfen bir sayfa seçin:</p>

      <div style={{ marginTop: "20px" }}>
        <Link href="/login">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Giriş</button>
        </Link>
        <Link href="/bakim">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Bakım</button>
        </Link>
      </div>
    </div>
  );
}
