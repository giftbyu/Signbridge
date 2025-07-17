import type { Metadata } from "next";
// Hapus impor font jika Anda mengimpornya di CSS
// import { Inter } from "next/font/google"; 
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SignBridge",
  description: "Aplikasi Penerjemah Bahasa Isyarat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Hapus className dari <body> agar CSS kita yang mengambil alih */}
      <body>{children}</body>
    </html>
  );
}