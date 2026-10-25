export const SITE = {
  url: "https://www.jgaldamez.com",
  name: "José Galdámez",
  title: "José Galdámez — Full-stack Developer",
  titleTemplate: "%s — José Galdámez",
  description:
    "José Galdámez is a full-stack developer based in Antigua Guatemala, building interfaces and full-stack products with React, Next.js, Node, and PostgreSQL.",
  jobTitle: "Full-stack Developer",
  themeColor: "#efedea",
  ogImage: "/og.jpg",
  ogImageWidth: "2400",
  ogImageHeight: "1260",
  ogImageAlt: "José Galdámez — Full-stack Developer",
} as const;

export const LOCALES = {
  en: { lang: "en", og: "en_US" },
  es: { lang: "es", og: "es_GT" },
} as const;

export type Locale = keyof typeof LOCALES;

export const AUTHOR = {
  // TODO: add `email: "hello@jgaldamez.com"` once the inbox is set up.
  location: {
    city: "Antigua Guatemala",
    country: "Guatemala",
    countryCode: "GT",
    coords: "14.5569° N, 90.7335° W",
  },
  github: "https://github.com/EladioGaldamez",
  linkedin: "https://www.linkedin.com/in/jgaldamez",
  // TODO: replace with the real Twitch handle once the channel exists.
  twitch: "https://www.twitch.tv/",
  socials: [
    "https://github.com/EladioGaldamez",
    "https://www.linkedin.com/in/jgaldamez",
  ],
  skills: [
    "React",
    "Next.js",
    "Astro",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "MySQL",
  ],
} as const;
