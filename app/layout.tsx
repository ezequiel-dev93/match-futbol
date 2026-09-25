import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const serifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-serif-display",
  subsets: ["latin"],
  display: "swap",
});

const messiFont = localFont({
  src: "../public/font/Messi_Font-Regular_licensed_v2.ttf",
  variable: "--font-messi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Match Fútbol — Búsqueda de Jugadores y Rivales",
  description:
    "Plataforma para encontrar jugadores y equipos rivales de fútbol 5, 7, 8 y 11 cerca tuyo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${serifDisplay.variable} ${messiFont.variable} dark h-full antialiased`}
    >
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
