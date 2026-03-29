import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const courts = [
    "parklands-sports-club","kasarani-indoor-basketball-arena","nairobi-international-school",
    "olive-crescent-school","absa-bank-sports-club","umoja-2-basketball-court",
    "langata-down-basketball-court","diwopa-basketball-court","usiu-basketball-court",
    "kobe-basketball-court","kq-pride-public-basketball-court","st-austins-academy-basketball-court",
    "kenya-science-basketball-court","camp-toyoyo-jericho","basketball-court-komarock",
    "good-testimony-international-basketball-court","ridgeways-basketball-court",
    "karen-gated-basketball-court","kibera-community-basketball-court","lenana-school-basketball-court",
    "university-of-nairobi-basketball-court","braeburn-schools-basketball-court","umama-play-ground",
    "ruiru-secondary-basketball-court","basketball-court-james-gichuru",
    "kenya-academy-of-sports-basketball-court","basketball-court-melili",
    "taarifa-road-sports-complex","uhuru-park-basketball-court",
    "eastleigh-high-school-basketball-court","basketball-court-mai-mahiu",
  ];

  const districts = [
    "westlands","kasarani","karen","kibera","langata","parklands",
    "lavington","eastleigh","cbd","umoja","komarock","ridgeways","ruiru",
  ];

  return [
    { url: "https://splinters.co.ke", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://splinters.co.ke/courts", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...courts.map((slug) => ({
      url: `https://splinters.co.ke/courts/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...districts.map((district) => ({
      url: `https://splinters.co.ke/courts/district/${district}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
