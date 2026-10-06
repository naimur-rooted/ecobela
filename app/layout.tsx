import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ShopProvider } from '@/context/ShopContext';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';

export const metadata: Metadata = {
  title: 'Ecobela — Bangladeshi Sustainable Luxury Fashion & Lifestyle',
  description: 'Discover artisanal Jamdani & Muslin sarees, royal panjabis, festive bridal couture, handcrafted jewellery, and authentic Bengal crafts at Ecobela.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  keywords: [
    'Ecobela',
    'Jamdani saree',
    'Muslin saree',
    'Rajshahi silk',
    'Bangladeshi panjabi',
    'Mirpur katan',
    'Nakshi kantha',
    'Bangladeshi fashion',
    'Dhaka fashion store',
    'Handloom Bangladesh',
    'Kundan jewellery',
    'Sustainable luxury',
  ],
  openGraph: {
    title: 'Ecobela — Bangladeshi Sustainable Luxury Fashion & Lifestyle',
    description: 'Discover artisanal Jamdani & Muslin sarees, royal panjabis, festive bridal couture, handcrafted jewellery, and authentic Bengal crafts at Ecobela.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ecobela',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecobela — Bangladeshi Sustainable Luxury Fashion & Lifestyle',
    description: 'Discover artisanal Jamdani & Muslin sarees, royal panjabis, festive bridal couture, handcrafted jewellery, and authentic Bengal crafts at Ecobela.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#EAE0D0] selection:text-neutral-900">
        <AuthProvider>
          <ShopProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
