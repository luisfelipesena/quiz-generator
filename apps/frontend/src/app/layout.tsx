import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Quiz Generator",
  description: "AI-powered quiz generator from PDF documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
