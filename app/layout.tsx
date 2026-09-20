import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frezanz — Beyond the Visible",
  description: "A cinematic, spiritual 3D web experience by Frezanz.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
