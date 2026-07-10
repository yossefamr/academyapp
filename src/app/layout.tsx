import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/components/lycans/ThemeProvider";
import PWARegister from "@/components/lycans/PWARegister";
import InstallPrompt from "@/components/lycans/InstallPrompt";
import { ACADEMY } from "@/lib/academy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(ACADEMY.website),
  title: `${ACADEMY.name} — ${ACADEMY.tagline}`,
  description: `${ACADEMY.name} — ${ACADEMY.tagline}. ${ACADEMY.branches.join(', ')} branches. Train under the moon, strike like lightning, rise through blood and silver.`,
  keywords: ["Lycans Fight Club", "MMA Academy", "MMA", "Muay Thai", "Boxing", "Brazilian Jiu-Jitsu", "Wrestling", "Judo", "Kickboxing", "Giza", "Egypt", ACADEMY.tagline],
  authors: [{ name: ACADEMY.name }],
  manifest: "/manifest.json",
  applicationName: "Lycans Fight Club",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lycans",
  },
  formatDetection: { telephone: true },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/icons/favicon-32.png"],
  },
  openGraph: {
    title: `${ACADEMY.name} — ${ACADEMY.tagline}`,
    description: `MMA Academy. Branches: ${ACADEMY.branches.join(', ')}. ${ACADEMY.phoneDisplay}`,
    siteName: ACADEMY.name,
    type: "website",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: ACADEMY.name,
    description: `${ACADEMY.tagline} — MMA Academy`,
  },
};

export const viewport: Viewport = {
  themeColor: "#c8102e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lycans" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
          <PWARegister />
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
