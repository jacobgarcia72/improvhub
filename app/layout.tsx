import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Header from "@/components/header";
import { appName } from "@/lib/app-info";
import BuyMeACoffee from "@/components/buy-me-a-coffee";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

config.autoAddCss = false; 

const inter = Inter({ subsets: ["latin"] });

const description = "Find improv shows, jams, and theatres. Create and manage improv troupes and events and connect with other improvisers!";
export const metadata: Metadata = {
  title: appName,
  description,
  openGraph: {
    title: appName,
    description,
    siteName: appName,
    // images: [
    //   {
    //     url: '/og-image.png', // Pointing to public/og-image.png
    //     width: 1200,
    //     height: 630,
    //     alt: appName,
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Header />
        <main className="mt-12">
          {children}
        </main>
        <Analytics />
        <BuyMeACoffee />
      </body>
    </html>
  );
}
