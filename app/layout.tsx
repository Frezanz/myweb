import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aperture — Make presence visible.",
  description: "A cinematic interactive experience for the web.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
