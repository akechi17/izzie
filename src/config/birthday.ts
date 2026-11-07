/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT
 * ─────────────────────────────────────────────────────────────
 *  Change the name, the words, the song and the photos here.
 *  Nothing else in the project needs touching.
 */

export type GalleryPhoto = {
  /** Path under /public. Leave empty (or omit) to show a pretty placeholder frame. */
  src: string;
  /** Alt text + the caption written on the Polaroid. */
  caption: string;
  /** Optional little date / place scribbled under the caption. */
  note?: string;
};

export type FlowerChoice = {
  id: string;
  label: string;
  /** Rendered as a tiny illustration in the bouquet. */
  shape: "tulip" | "daisy" | "rose" | "sunflower" | "babys-breath";
  hue: string;
  /** How many of this flower the visitor may add. */
  limit: number;
};

export type BirthdayConfig = {
  recipientName: string;
  senderName: string;
  musicTitle: string;
  musicArtist: string;
  musicSrc: string;
  openingMessage: string;
  openingSubline: string;
  gardenMessage: string;
  wishMessage: string;
  bouquetMessage: string;
  letterText: string;
  finalMessage: string;
  galleryPhotos: GalleryPhoto[];
  flowerChoices: FlowerChoice[];
  theme: {
    /** Every illustration of a cat in the experience, in one place. */
    cast: Record<CastName, CastAsset>;
    /** Turn confetti off entirely if you'd rather keep it calm. */
    confetti: boolean;
    /** Music resets to 0:00 when the visitor replays. */
    restartMusicOnReplay: boolean;
  };
};

export type CastName =
  | "host"
  | "sleepy"
  | "shark"
  | "party"
  | "bouquet"
  | "loaf"
  | "peeking"
  | "tiny"
  | "sitting"
  | "cosy";

export type CastAsset = { src: string; width: number; height: number };

export const birthday: BirthdayConfig = {
  recipientName: "Izzah",
  senderName: "Rafie",

  musicTitle: "Little Daylight",
  musicArtist: "for Izzah",
  /** Replace the file at public/assets/music/birthday-song.mp3 (or change this path). */
  musicSrc: "/assets/music/birthday-song.mp3",

  openingMessage: "I have a little surprise for you…",
  openingSubline: "I folded a whole afternoon into this envelope.",

  gardenMessage:
    "The garden woke up early just to say it. Everything here is for you.",

  wishMessage: "Before you make a wish, let's blow the candles!",

  bouquetMessage:
    "This virtual bouquet is for you, I might give the real one later :p",

  letterText:
    "Happy 18th Birthday, Izzah!\n\nI hope this year brings you gentle days, wonderful surprises, new adventures, and countless reasons to smile. I know you've done so much and achieved many things this year, i'm proud of you!\n\nI hope today and many more days to come are filled with joy and laughter.\n\nWish you all the best,\n♡",

  finalMessage:
    "Once again, Happy Birthday! I hope your world is always filled with little reasons to smile. ♡",

  galleryPhotos: [
    {
      src: "/assets/izzah/1.jpg",
      caption: "😛😛😛",
      note: "lucu bangetttt :p",
    },
    {
      src: "/assets/izzah/2.jpg",
      caption: "Kucinggg",
      note: "Kucing di tempat lesen Izzah",
    },
    {
      src: "/assets/izzah/3.jpg",
      caption: "Izzah bawa motor",
      note: "Keren sekarang udah bisa bawa motor :D",
    },
    {
      src: "/assets/izzah/4.jpg",
      caption: "Kucing di depan rumah Izzah",
      note: "lucuu suka tidur, kayak izzah",
    },
    {
      src: "/assets/izzah/5.jpg",
      caption: "✌️",
      note: "cantik bangetttt XD",
    },
  ],

  flowerChoices: [
    { id: "tulip", label: "Tulips", shape: "tulip", hue: "#f2a9bd", limit: 4 },
    { id: "daisy", label: "Daisies", shape: "daisy", hue: "#fff7e6", limit: 4 },
    { id: "rose", label: "Roses", shape: "rose", hue: "#e98c8c", limit: 3 },
    {
      id: "sunflower",
      label: "Sunflowers",
      shape: "sunflower",
      hue: "#f2c85b",
      limit: 3,
    },
    {
      id: "babys-breath",
      label: "Baby's breath",
      shape: "babys-breath",
      hue: "#fdfbf4",
      limit: 6,
    },
  ],

  theme: {
    /**
     * The recurring cast. Swap any file in /public/assets/characters and keep
     * the shape — every scene pulls its cats from here so they stay consistent.
     */
    cast: {
      /** The cat that hosts the garden and the finale. */
      host: {
        src: "/assets/characters/sticker-31.webp",
        width: 209,
        height: 174,
      },
      /** Curled up, used in the letter and the memory lane. */
      sleepy: {
        src: "/assets/characters/sticker-52.webp",
        width: 379,
        height: 200,
      },
      /** Shark hoodie — the mascot of the opening envelope. */
      shark: {
        src: "/assets/characters/sticker-12.webp",
        width: 162,
        height: 211,
      },
      /** Party hat, used beside the cake. */
      party: {
        src: "/assets/characters/sticker-02.webp",
        width: 160,
        height: 239,
      },
      /** Holding a bouquet, used in the flower scene. */
      bouquet: {
        src: "/assets/characters/sticker-58.webp",
        width: 200,
        height: 196,
      },
      /** Flat loaf, used as a tiny footer doodle. */
      loaf: {
        src: "/assets/characters/sticker-46.webp",
        width: 161,
        height: 85,
      },
      /** Peeking over an edge, used for speech bubbles. */
      peeking: {
        src: "/assets/characters/sticker-34.webp",
        width: 144,
        height: 135,
      },
      /** Very small doodle for sparkle-sized placements. */
      tiny: {
        src: "/assets/characters/sticker-26.webp",
        width: 99,
        height: 123,
      },
      /** Sitting up straight, the "listener". */
      sitting: {
        src: "/assets/characters/sticker-37.webp",
        width: 350,
        height: 73,
      },
      /** Wrapped in a blanket. */
      cosy: {
        src: "/assets/characters/sticker-06.webp",
        width: 166,
        height: 233,
      },
    },
    confetti: true,
    restartMusicOnReplay: true,
  },
};
