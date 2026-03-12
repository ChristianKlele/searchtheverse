import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SearchTheVerse",
  description: "Search the King James Bible by verse, range, chapter, or keyword.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}