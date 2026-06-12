import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pazelgreen Technologies",
  description: "Innovating the future of sustainable agriculture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Shared across all pages */}
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
