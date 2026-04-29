// src/app/layout.tsx v2.3.8
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { WebVitals } from "@/components/performance/WebVitals";



// Reusable Google Analytics script component
const GoogleAnalyticsScript = () => {
  const AnalyticsTags = (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-B3R0GXSDY8" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B3R0GXSDY8');
          `
        }
      </Script>
    </>
  );

  // Only load Google Analytics in production and not on localhost
  if (process.env.NODE_ENV === 'production') {
    if (typeof window === 'undefined') {
      // Server-side: always return AnalyticsTags in production
      return AnalyticsTags;
    } else {
      // Client-side: check if not localhost
      return !window.location.hostname.match(/localhost|127\.0\.0\.1/) ? AnalyticsTags : null;
    }
  }
  return null;
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aura.ewuse.com/"),
  title: "Aura Flux v2.3.8",
  description: "Experience Aura Flux: A next-gen 3D music visualizer powered by Google Gemini AI. Transform microphone input into real-time, audio-reactive WebGL art.",
  keywords: ["music visualizer", "audio visualizer", "AI music recognition", "Google Gemini", "WebGL", "Three.js", "React 19", "generative art", "synesthesia"],
  authors: [{ name: "Sut" }],
  openGraph: {
    type: "website",
    url: "https://aura.ewuse.com/",
    title: "Aura Flux | AI Music Visualizer",
    description: "High-fidelity 3D audio reactive art powered by Google Gemini. Listen to the sound of light.",
    images: ["/pwa-icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Google Analytics - only load in production */}
        <GoogleAnalyticsScript />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} antialiased bg-black text-white`}>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
