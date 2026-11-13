import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CivicPulse v2 | Tamil Nadu Civic Infrastructure Network",
  description:
    "Unified civic action portal for Citizens, Field Workers, and Municipal Administrators across Chennai, Coimbatore, and Madurai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-semibold text-slate-700">
              CivicPulse v2 • Tamil Nadu Municipal Incident Management System
            </p>
            <p className="text-slate-400">
              Next.js 15 • App Router • Prisma ORM • PostgreSQL • Leaflet GIS
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
