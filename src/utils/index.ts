import type { Level } from "@Src/types";

export const ascsFromLv = (lv: Level) => {
  const maxLv = +lv.slice(-2);
  return maxLv === 20 ? 0 : maxLv / 10 - 3;
};

export const wikiImg = (src: string) =>
  `https://static.wikia.nocookie.net/gensin-impact/images/${src}.png`;
