import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Padel Courts in Nairobi — 17 Verified Venues | Splinters",
  description: "Find every padel court in Nairobi. 17 verified venues across Westlands, Gigiri, Karen, Lavington and more. Real directions, ratings and booking. Splinters — Nairobi's sports discovery platform.",
  keywords: [
    "padel nairobi", "padel courts nairobi", "where to play padel nairobi",
    "padel kenya", "padel westlands", "padel gigiri", "padel karen",
    "padel lavington", "padel court near me nairobi", "best padel nairobi",
    "padel tennis nairobi", "nairobi padel clubs", "book padel court nairobi",
    "padel for beginners nairobi", "padel lessons nairobi", "padel tournaments nairobi",
    "networks padel village", "padel point kenya", "padel 254", "gigiri social club padel",
    "rackets and rounds nairobi", "ace padel kenya", "playon padel nairobi",
    "zen padel nairobi", "254 racquet club", "ridgeway padel", "destination padel tigoni",
    "splinters padel", "fastest growing sport nairobi", "padel near me",
  ],
  alternates: { canonical: "https://splinters.co.ke/padel" },
  openGraph: {
    title: "Padel Courts in Nairobi — 17 Verified Venues | Splinters",
    description: "Find every padel court in Nairobi. Westlands, Gigiri, Karen, Lavington and more. Real GPS directions and booking links.",
    url: "https://splinters.co.ke/padel",
    images: [{ url: "https://splinters.co.ke/splinters-logo.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Padel Courts in Nairobi — Splinters",
    description: "17 verified padel venues in Nairobi. Find your court, get directions, book now.",
    images: ["https://splinters.co.ke/splinters-logo.jpg"],
  },
};

export default function PadelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
