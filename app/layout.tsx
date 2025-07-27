import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import LoadingScreen from "./components/LoadingScreen";
import PreloadLinks from "./components/PreloadLinks";
import ErrorBoundary from "./components/ErrorBoundary";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LA Familietur 2025",
  description: "Rejseplan og information for LA ferie",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LA Tur",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "LA Familietur 2025",
    description: "Rejseplan og information for LA ferie",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LA Familietur 2025",
    description: "Rejseplan og information for LA ferie",
  },
};

export const viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body
        className={`${fredoka.variable} ${inter.variable} antialiased`}
      >
        <ServiceWorkerRegistration />
        <LoadingScreen />
        <PreloadLinks />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
