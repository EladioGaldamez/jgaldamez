import type { Locale } from "@/consts";

export const defaultLocale: Locale = "en";

export const ui = {
  en: {
    "meta.title": "José Galdámez — Full-stack Developer",
    "meta.description":
      "José Galdámez is a full-stack developer based in Antigua Guatemala, building interfaces and full-stack products with React, Next.js, Node, and PostgreSQL.",

    "loader.label": "Sharpening pencils…",

    "hero.first": "José",
    "hero.last": "Galdámez",
    "hero.bio":
      "Full-stack developer from Antigua Guatemala. I build interfaces and products with React, Next.js and Node — and I sketch the rest of my life in graphite.",
    "hero.role": "Full-stack dev",
    "hero.city": "Antigua Guatemala",
    "hero.since": "Coding since 2019",
    "hero.scroll": "Scroll",

    "about.label": "About",
    "about.title": "A few snapshots of me",
    "about.p1":
      "I'm José. I've spent the last six years turning ideas into interfaces — from early sketches to production apps people actually use.",
    "about.p2":
      "Most days I live between React, Next.js, Astro and Tailwind on the front, with Node.js, PostgreSQL and MySQL holding things up behind the scenes.",
    "about.p3":
      "I care about the small stuff: a transition that feels right, a layout that breathes, a loading state that doesn't make you wait for nothing.",
    "about.p4":
      "Off the keyboard you'll find me laughing too loud, wearing a cap or a beanie (never both), and making faces at cameras — exhibit A, on the left.",
    "about.caption1": "the look-away",
    "about.caption2": "the big smile",
    "about.caption3": "peace & beanie",
    "about.caption4": "the wink",

    "work.label": "Selected work",
    "work.title": "From the sketchbook",
    "work.intro":
      "A short list on purpose — a few things I've built or helped ship.",
    "work.more": "More on GitHub",
    "work.view": "View",

    "hobbies.label": "Off-screen",
    "hobbies.title": "Player one, ready",
    "hobbies.p1":
      "When the editor closes, the controller comes out. Story games, co-op nights, and the occasional rage-quit.",
    "hobbies.p2":
      "Soon I'll be streaming on Twitch — chill gameplay, some dev talk, and a lot of bad jokes. Come hang out.",
    "hobbies.status": "Offline — coming soon",
    "hobbies.cta": "Follow on Twitch",

    "dogs.label": "The pack",
    "dogs.title": "Kira & Nala",
    "dogs.intro":
      "Two dogs, one ball, zero personal space. The real bosses of the house.",
    "dogs.pending": "Drawing in progress",
    "dogs.born": "Born",
    "dogs.adopted": "Adopted",
    "dogs.favorite": "Favorite thing",
    "dogs.ball": "Kira's ball — Nala wants it",
    "dogs.count": "pups",

    "footer.title": "Let's draw something together",
    "footer.ctaLabel": "Got an idea? Say hi",
    "footer.cta": "Message me",
    "footer.top": "Back to top",
    "footer.rights": "Sketched in Guatemala",
    "footer.lang": "Español",
  },
  es: {
    "meta.title": "José Galdámez — Desarrollador Full-stack",
    "meta.description":
      "José Galdámez es un desarrollador full-stack en Antigua Guatemala que construye interfaces y productos con React, Next.js, Node y PostgreSQL.",

    "loader.label": "Afilando lápices…",

    "hero.first": "José",
    "hero.last": "Galdámez",
    "hero.bio":
      "Desarrollador full-stack de Antigua Guatemala. Construyo interfaces y productos con React, Next.js y Node — y el resto de mi vida lo dibujo en grafito.",
    "hero.role": "Full-stack dev",
    "hero.city": "Antigua Guatemala",
    "hero.since": "Programando desde 2019",
    "hero.scroll": "Scroll",

    "about.label": "Sobre mí",
    "about.title": "Algunas instantáneas mías",
    "about.p1":
      "Soy José. Llevo seis años convirtiendo ideas en interfaces — desde los primeros bocetos hasta apps en producción que la gente usa de verdad.",
    "about.p2":
      "Casi todos los días vivo entre React, Next.js, Astro y Tailwind en el front, con Node.js, PostgreSQL y MySQL sosteniendo todo detrás.",
    "about.p3":
      "Me importan los detalles: una transición que se siente bien, un layout que respira, un loading que no te hace esperar por nada.",
    "about.p4":
      "Lejos del teclado me vas a encontrar riéndome muy fuerte, con gorra o gorro (nunca ambos), y haciéndole caras a las cámaras — prueba A, a la izquierda.",
    "about.caption1": "mirando al horizonte",
    "about.caption2": "la gran sonrisa",
    "about.caption3": "paz y gorro",
    "about.caption4": "el guiño",

    "work.label": "Proyectos",
    "work.title": "Del cuaderno de bocetos",
    "work.intro":
      "Una lista corta a propósito — algunas cosas que construí o ayudé a lanzar.",
    "work.more": "Más en GitHub",
    "work.view": "Ver",

    "hobbies.label": "Fuera de pantalla",
    "hobbies.title": "Jugador uno, listo",
    "hobbies.p1":
      "Cuando se cierra el editor, sale el control. Juegos de historia, noches de co-op y uno que otro rage-quit.",
    "hobbies.p2":
      "Pronto voy a estar haciendo streams en Twitch — gameplay tranquilo, algo de charla dev y muchos chistes malos. Llégale.",
    "hobbies.status": "Offline — muy pronto",
    "hobbies.cta": "Seguir en Twitch",

    "dogs.label": "La manada",
    "dogs.title": "Kira & Nala",
    "dogs.intro":
      "Dos perritas, una pelota y cero espacio personal. Las verdaderas jefas de la casa.",
    "dogs.pending": "Dibujo en proceso",
    "dogs.born": "Nació",
    "dogs.adopted": "Adoptada",
    "dogs.favorite": "Lo favorito",
    "dogs.ball": "La pelota de Kira — Nala la quiere",
    "dogs.count": "perritas",

    "footer.title": "Dibujemos algo juntos",
    "footer.ctaLabel": "¿Tienes una idea? Hablemos",
    "footer.cta": "Escríbeme",
    "footer.top": "Volver arriba",
    "footer.rights": "Dibujado en Guatemala",
    "footer.lang": "English",
  },
} as const;

export type UIKey = keyof (typeof ui)["en"];

export function getLocale(value: string | undefined): Locale {
  return value && value in ui ? (value as Locale) : defaultLocale;
}

export function useTranslations(lang: Locale) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLocale][key];
  };
}
