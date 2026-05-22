import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Splinters Basketball",
  "description": "Find and book basketball courts in Nairobi. 31+ verified courts across Westlands, Kasarani, Karen, Kibera, Langata and more.",
  "url": "https://splinters.co.ke",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nairobi",
    "addressCountry": "KE"
  }
};

export const metadata: Metadata = {
  metadataBase: new URL("https://splinters.co.ke"),
  title: {
    default: "Splinters — Find Basketball Courts in Nairobi | 31+ Verified Courts",
    template: "%s | Splinters Basketball Nairobi",
  },
  description: "Discover and book basketball courts in Nairobi. 31+ verified courts across Westlands, Kasarani, Karen, Kibera, Langata and more. Find your court, join the community, play today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#ffffff", color: "#111111", fontFamily: "DM Sans, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
