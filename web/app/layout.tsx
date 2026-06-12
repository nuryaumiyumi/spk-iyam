import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPK Tomat Terbaik — Metode SAW",
  description:
    "Sistem Pendukung Keputusan pemilihan tomat berkualitas tinggi menggunakan metode Simple Additive Weighting (SAW).",
  applicationName: "SPK Tomat Terbaik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-cream flex min-h-full flex-col font-sans text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}
