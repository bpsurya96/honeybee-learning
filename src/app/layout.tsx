import type { Metadata } from "next";
import { Quicksand, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import FloatingBee from "@/components/ui/FloatingBee";

const quicksand = Quicksand({
  variable: "--font-heading",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://honeybeelearning.co.in'),
  title: "HoneyBee Learning | Premium Kids Activity Books",
  description: "India's first personalised activity book for kids. Educational, fun, and completely customised for your child.",
  openGraph: {
    title: "HoneyBee Learning",
    description: "Personalised Activity Books for Kids",
    url: 'https://honeybeelearning.co.in',
    siteName: 'HoneyBee Learning',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HoneyBee Learning Activity Books',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoneyBee Learning | Premium Kids Activity Books',
    description: "India's first personalised activity book for kids.",
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body bg-bg-cream text-text-dark-brown">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <FloatingWhatsApp />
            <FloatingBee />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


