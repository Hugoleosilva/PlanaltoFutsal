import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Planalto Futsal",
  description:
    "App oficial do Planalto Futsal - equipe de futebol e futsal de várzea do Jardim Planalto, Sancho, Zona Oeste do Recife-PE.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Planalto Futsal",
  },
};

export const viewport: Viewport = {
  themeColor: "#C41E24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${oswald.variable}`}>
      <body className="flex min-h-screen flex-col font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
