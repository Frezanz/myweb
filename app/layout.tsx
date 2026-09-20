import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Frezanz — a space between light and shadow", description: "An interactive 3D visual experience by Frezanz." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }