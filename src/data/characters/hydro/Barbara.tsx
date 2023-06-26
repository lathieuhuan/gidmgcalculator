import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const Barbara: DataCharacter = {
  code: 15,
  name: "Barbara",
  icon: "6/6a/Barbara_Icon",
  sideIcon: "3/39/Barbara_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "hydro",
  weaponType: "catalyst",
  stats: [
    [821, 13, 56],
    [2108, 34, 144],
    [2721, 44, 186],
    [4076, 66, 279],
    [4512, 73, 308],
    [5189, 84, 355],
    [5770, 94, 394],
    [6448, 105, 441],
    [6884, 112, 470],
    [7561, 123, 517],
    [7996, 130, 546],
    [8674, 141, 593],
    [9110, 148, 623],
    [9787, 159, 669],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Whisper of Water",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 37.84 },
        { name: "2-Hit", multFactors: 35.52 },
        { name: "3-Hit", multFactors: 41.04 },
        { name: "4-Hit", multFactors: 55.2 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 166.24 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Let the Show Begin♪",
      image: "9/95/Talent_Let_the_Show_Begin%E2%99%AA",
      stats: [
        {
          name: "HP Regen. per Hit",
          notAttack: "healing",
          multFactors: { root: 0.75, attributeType: "hp" },
          flatFactor: 72,
        },
        {
          name: "Continuous Regen.",
          notAttack: "healing",
          multFactors: { root: 4, attributeType: "hp" },
          flatFactor: 385,
        },
        { name: "Droplet DMG", multFactors: 58.4 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "32s" },
      // ],
    },
    EB: {
      name: "Shining Miracle♪",
      image: "c/cb/Talent_Shining_Miracle%E2%99%AA",
      stats: [
        {
          name: "Regeneration",
          notAttack: "healing",
          multFactors: { root: 17.6, attributeType: "hp" },
          flatFactor: 1694,
        },
      ],
      // getExtraStats: () => [{ name: "CD", value: "20s" }],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Glorious Season", image: "4/49/Talent_Glorious_Season" },
    { name: "Encore", image: "3/3f/Talent_Encore" },
    { name: "With My Whole Heart♪", image: "4/4f/Talent_With_My_Whole_Heart%E2%99%AA" },
  ],
  constellation: [
    { name: "Gleeful Songs", image: "b/b7/Constellation_Gleeful_Songs" },
    { name: "Vitality Burst", image: "1/14/Constellation_Vitality_Burst" },
    { name: "Star of Tomorrow", image: "6/67/Constellation_Star_of_Tomorrow" },
    { name: "Attentiveness be My Power", image: "3/30/Constellation_Attentiveness_Be_My_Power" },
    { name: "The Purest Companionship", image: "6/69/Constellation_The_Purest_Companionship" },
    {
      name: "Dedicating Everything to You",
      image: "a/a0/Constellation_Dedicating_Everything_to_You",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          During Let the Show Begin's [ES] duration, your active character gains a <Green b>15%</Green>{" "}
          <Green>Hydro DMG Bonus</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "hydro", 15),
    },
  ],
};

export default Barbara;
