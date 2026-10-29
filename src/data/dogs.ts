import type { ImageMetadata } from "astro";
import type { Locale } from "@/consts";
import kira from "@/assets/sketches/dog-kira.jpg";
import nala from "@/assets/sketches/dog-nala.jpg";

type Localized = Record<Locale, string>;

export interface Dog {
  name: string;
  role: Localized;
  born: Localized;
  adopted: Localized;
  favorite: Localized;
  /** Short handwritten note next to the sketch. */
  note: Localized;
  quirks: Localized[];
  /** Pencil portrait; without it a "drawing in progress" placeholder is shown. */
  image?: ImageMetadata;
}

export const dogs: Dog[] = [
  {
    image: kira,
    name: "Kira",
    role: { en: "The big sister", es: "La hermana mayor" },
    born: { en: "Sep 12, 2017", es: "12 sep 2017" },
    adopted: { en: "Dec 2017", es: "Dic 2017" },
    favorite: { en: "The ball", es: "La pelota" },
    note: { en: "ball = life", es: "pelota = vida" },
    quirks: [
      {
        en: "Carries her ball everywhere. And we mean everywhere.",
        es: "Anda con su pelota por todos lados. Todos.",
      },
      {
        en: "Ignore her and the ball lands on your feet — and stays there until you throw it.",
        es: "Si no le pones atención, te deja la pelota en los pies hasta que juegues con ella.",
      },
      {
        en: "Loves hanging out in the kitchen, but is way too polite to take anything you don't offer.",
        es: "Le encanta ir a la cocina, pero es demasiado respetuosa: si no le das, no come.",
      },
    ],
  },
  {
    image: nala,
    name: "Nala",
    role: { en: "The baby of the family", es: "La bebé de la familia" },
    born: { en: "Jan 10, 2024", es: "10 ene 2024" },
    adopted: {
      en: "By my sister — I'm the babysitter",
      es: "Por mi hermana — yo la cuido",
    },
    favorite: { en: "Her little bed", es: "Su camita" },
    note: { en: "zzz…", es: "zzz…" },
    quirks: [
      {
        en: "Energy for two, mostly spent bugging Kira.",
        es: "Energía para dos, casi toda la usa para molestar a Kira.",
      },
      {
        en: "When she's not playing, she's asleep in her little bed.",
        es: "Cuando no está jugando, está dormida en su camita.",
      },
      {
        en: "Professional puppy eyes. She wants your food, and you will fall for it. Every time.",
        es: "Te hace ojitos para que le des comida… y siempre caes en su trampa.",
      },
    ],
  },
];
