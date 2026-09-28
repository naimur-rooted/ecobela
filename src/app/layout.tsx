import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/providers";
import { getCategoryTree } from "@/lib/catalog";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Eco Bela";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Ethically made handcrafted products`,
    template: `%s · ${siteName}`,
  },
  description:
    "Eco Bela is an omnichannel store for ethically made clothing, crafts and home goods from Bangladeshi artisans.",
  keywords:
    "handcrafted, Bangladesh, saree, panjabi, nakshi kantha, ethical fashion, artisan",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: categories } = await getCategoryTree();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header categories={categories} />
          <Navbar categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
        </Providers>
      </body>
    </html>
  );
}
