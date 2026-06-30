import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { appName } from "@/lib/app-info";
import BuyMeACoffee from "@/components/buy-me-a-coffee";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = "Find improv shows, jams, and theatres. Create and manage improv teams and events and connect with other improvisers!";
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
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="mt-12">
          {children}
        </main>
        <BuyMeACoffee />
      </body>
    </html>
  );
}
