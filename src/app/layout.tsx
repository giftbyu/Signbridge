import type { Metadata, Viewport } from 'next';
import './globals.css';

// Mengatur judul dan deskripsi default untuk aplikasi Anda
export const metadata: Metadata = {
  title: 'SignBridge',
  description: 'Aplikasi Penerjemah Bahasa Isyarat SIBI & BISINDO',
};

// INI BAGIAN PALING PENTING: Mengatur viewport untuk mobile
export const viewport: Viewport = {
  width: 'device-width',      // Mengatur lebar halaman sesuai lebar perangkat
  initialScale: 1,            // Mengatur zoom awal ke 100%
  maximumScale: 1,            // Mencegah pengguna melakukan zoom-in
  userScalable: false,        // Mencegah pengguna melakukan zoom
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}