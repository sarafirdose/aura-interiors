import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Script from "next/script";

import CustomCursor from "@/components/CustomCursor";
import Particles from "@/components/Particles";
import Minimap from "@/components/Minimap";
import ThemeWrapper from "@/components/ThemeWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura | Luxury Interiors",
  description: "Experience the pinnacle of luxury interior design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" strategy="lazyOnload" />
        <ThemeWrapper>
          <SmoothScroll>
            <CustomCursor />
            <Particles />
            <Minimap />
            <Navigation />
            {children}
          </SmoothScroll>
        </ThemeWrapper>
      </body>
    </html>
  );
}
