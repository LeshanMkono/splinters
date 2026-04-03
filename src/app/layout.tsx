import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://splinters.co.ke"),
  title: {
    default: "Splinters — Find Basketball Courts in Nairobi | 31+ Verified Courts",
    template: "%s | Splinters Basketball Nairobi",
  },
  description: "Discover and book basketball courts in Nairobi. 31+ verified courts across Westlands, Kasarani, Karen, Kibera, Langata and more. Find your court, join the community, play today.",
  keywords: [
    "basketball courts nairobi",
    "where to play basketball nairobi",
    "hoop nairobi",
    "basketball court westlands",
    "basketball court kasarani",
    "basketball court karen",
    "nairobi basketball community",
    "splinters basketball",
    "book basketball court nairobi",
    "basketball court near me nairobi",
    "kenya basketball",
  ],
  openGraph: {
    title: "Splinters — Find Basketball Courts in Nairobi",
    description: "31+ verified basketball courts across Nairobi. Search, find, and book your court today.",
    url: "https://splinters.co.ke",
    siteName: "Splinters Basketball",
    images: [{ url: "https://splinters.co.ke/splinters-logo.jpg", width: 500, height: 500, alt: "Splinters Basketball Nairobi" }],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Splinters — Find Basketball Courts in Nairobi",
    description: "31+ verified basketball courts across Nairobi. Search, find, and book your court today.",
    images: ["https://splinters.co.ke/splinters-logo.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  alternates: { canonical: "https://splinters.co.ke" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
