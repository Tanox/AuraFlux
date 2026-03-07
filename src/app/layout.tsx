import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aura.ewuse.com/"),
  title: "Aura Flux v2.0.0",
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
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js" strategy="beforeInteractive" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-B3R0GXSDY8" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B3R0GXSDY8');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
