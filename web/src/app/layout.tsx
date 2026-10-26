import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "EvidenceGraph — grounded literature answers",
  description:
    "Trace scientific answers to reviewed claims and exact source passages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
