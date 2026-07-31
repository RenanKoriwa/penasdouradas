import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Editora Penas Douradas",
  description: "Publicando o melhor do thriller e suspense.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${cinzel.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-text-primary selection:bg-accent selection:text-bg">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1 flex flex-col relative z-10">{children}</main>
          <FloatingWhatsApp />
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
