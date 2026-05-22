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
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-1.2833",
    "longitude": "36.8167"
  },
  "sameAs": [
    "https://www.instagram.com/splinters_basketball_",
    "https://www.tiktok.com/@splintersbasketball_ke"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127"
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-FWW054P0X0" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FWW054P0X0');
          `}
        </Script>
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
