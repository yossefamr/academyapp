import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/components/lycans/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lycans Fight Club — Fearless Fighters",
  description: "MMA academy forged in shadow. Train under the moon, strike like lightning, rise through blood and silver.",
  keywords: ["Lycans", "Fight Club", "MMA", "martial arts", "training", "fearless fighters"],
  authors: [{ name: "Lycans Fight Club" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Lycans Fight Club",
    description: "Fearless Fighters — train like a lycan.",
    siteName: "Lycans Fight Club",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
