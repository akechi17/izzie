import { birthday } from "@/config/birthday";

export const SCENES = [
  { key: "opening", label: "The envelope" },
  { key: "music", label: "The song" },
  { key: "garden", label: "The garden" },
  { key: "wish", label: "The candles" },
  { key: "bouquet", label: "The flowers" },
  { key: "letter", label: "The letter" },
  { key: "memories", label: "Our little museum" },
  { key: "final", label: "The last page" },
] as const;

export type SceneKey = (typeof SCENES)[number]["key"];

export const SCENE_COUNT = SCENES.length;

export const OPENING = birthday.openingMessage;
