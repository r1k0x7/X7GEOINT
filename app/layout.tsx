import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X7 GEOINT COMMAND CENTER | Global Intelligence Platform",
  description: "Advanced Geospatial Intelligence Command Center with real-time 3D Earth visualization, OSINT integration, satellite tracking, conflict monitoring, and AI analytics.",
  keywords: "GEOINT, geospatial intelligence, command center, satellite tracking, OSINT, military intelligence, 3D globe, real-time monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-x7-black text-x7-text min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
