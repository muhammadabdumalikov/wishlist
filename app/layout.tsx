import type { Metadata } from "next";
import localFont from "next/font/local";
import { Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inconsolata = localFont({
  src: [
    {
      path: "../public/fonts/inconsolata.regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/inconsolata.bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inconsolata",
  display: "swap",
});

const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wishlist",
  description: "List of things which you can gift to me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inconsolata.variable} ${sourceSansPro.variable} antialiased`}
      >
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
