import { MetadataRoute } from "next";

const BASE = "https://splinters.co.ke";
const NOW = new Date();

const BASKETBALL_COURTS = [
  "parklands-sports-club",
  "kasarani-indoor-basketball-arena",
  "nairobi-international-school",
  "olive-crescent-school",
  "absa-bank-sports-club",
  "umoja-2-basketball-court",
  "langata-down-basketball-court",
  "diwopa-basketball-court",
  "usiu-basketball-court",
  "kobe-basketball-court",
  "kq-pride-public-basketball-court",
  "st-austins-academy-basketball-court",
  "kenya-science-basketball-court",
  "camp-toyoyo-jericho",
  "basketball-court-komarock",
  "good-testimony-international-basketball-court",
  "ridgeways-basketball-court",
  "karen-gated-basketball-court",
  "kibera-community-basketball-court",
  "lenana-school-basketball-court",
  "university-of-nairobi-basketball-court",
  "braeburn-schools-basketball-court",
  "umama-play-ground",
  "ruiru-secondary-basketball-court",
  "basketball-court-james-gichuru",
  "kenya-academy-of-sports-basketball-court",
  "basketball-court-melili",
  "taarifa-road-sports-complex",
  "uhuru-park-basketball-court",
  "eastleigh-high-school-basketball-court",
  "basketball-court-mai-mahiu",
];

const PADEL_VENUES = [
  "networks-padel-village",
  "gigiri-social-club",
  "sd-padel-gigiri-courtyard",
  "padel-kenya-westlands",
  "rackets-and-rounds",
  "padel-254-goan-gymkhana",
  "ace-padel-kenya",
  "pro-padel-nairobi",
  "playon-padel-westlands",
  "zen-padel-zen-garden",
  "254-racquet-club",
  "playon-padel-lavington",
  "arena-padel",
  "the-padel-point-kenya",
  "ridgeway-padel-club",
  "duma-padel-ole-sereni",
  "destination-padel-tigoni",
];

const DISTRICTS = [
  "westlands",
  "kasarani",
  "karen",
  "kibera",
  "langata",
  "parklands",
  "lavington",
  "eastleigh",
  "cbd",
  "umoja",
  "komarock",
  "ridgeways",
  "ruiru",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,                      priority: 1.0,  freq: "weekly"  as const },
    { url: `${BASE}/courts`,          priority: 0.95, freq: "daily"   as const },
    { url: `${BASE}/padel`,           priority: 0.9,  freq: "weekly"  as const },
    { url: `${BASE}/courts/district`, priority: 0.85, freq: "weekly"  as const },
  ].map(({ url, priority, freq }) => ({
    url,
    lastModified: NOW,
    changeFrequency: freq,
    priority,
  }));

  return [
    ...staticPages,
    ...BASKETBALL_COURTS.map((slug) => ({
      url: `${BASE}/courts/${slug}`,
      lastModified: NOW,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...PADEL_VENUES.map((slug) => ({
      url: `${BASE}/padel/${slug}`,
      lastModified: NOW,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...DISTRICTS.map((district) => ({
      url: `${BASE}/courts/district/${district}`,
      lastModified: NOW,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
