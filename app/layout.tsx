import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthGuard } from "@/components/auth-guard";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HIRA - AI Agent HRIS",
  description: "Smart HRIS dan AI Agent untuk layanan karyawan otomatis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
