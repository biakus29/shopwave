import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopWave | Modern Multi-Vendor Ecommerce Platform",
  description: "Launch your independent shop in seconds. The powerful SaaS platform for small businesses with direct WhatsApp integration.",
  keywords: ["ecommerce", "saas", "multi-vendor", "shopify alternative", "whatsapp shopping", "small business"],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#8b5cf6',
}

import { FirebaseAuthProvider } from "@/components/providers/firebase-auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-primary/20 selection:text-primary font-sans`}>
        <FirebaseAuthProvider>
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
