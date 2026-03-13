import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SearchTheVerse",
  description: "Search the King James Bible by verse, range, chapter, or keyword.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "SearchTheVerse",
    description: "Search the King James Bible instantly.",
    url: "https://searchtheverse.net",
    siteName: "SearchTheVerse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SearchTheVerse Bible search preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SearchTheVerse",
    description: "Search the King James Bible instantly.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
