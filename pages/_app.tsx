import type { AppProps } from "next/app";
import "../styles/globals.css"; // Tailwind için stiller

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
