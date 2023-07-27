import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkCons, exclBuff } from "../utils";

const Fischl: DefaultAppCharacter = {
  code: 8,
  name: "Fischl",
  icon: "9/9a/Fischl_Icon",
  sideIcon: "b/b8/Fischl_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [770, 20, 50],
    [1979, 53, 128],
    [2555, 68, 165],
    [3827, 102, 247],
    [4236, 113, 274],
    [4872, 130, 315],
    [5418, 144, 350],
    [6054, 161, 391],
    [6463, 172, 418],
    [7099, 189, 459],
    [7508, 200, 485],
    [8144, 216, 526],
    [8553, 227, 553],
    [9189, 244, 594],
  ],
  bonusStat: {
    type: "atk_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 44.12 },
      { name: "2-Hit", multFactors: 46.78 },
      { name: "3-Hit", multFactors: 58.14 },
      { name: "4-Hit", multFactors: 57.71 },
      { name: "5-Hit", multFactors: 72.07 },
      {
        name: "Oz's Joint Attack (C1)",
        multFactors: { root: 22, scale: 0 },
      },
    ],
    CA: [
      ...BOW_CAs,
      {
        name: "Thundering Retribution (A1)",
        attElmt: "electro",
        multFactors: { root: 189.35, scale: 0 },
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      { name: "Oz's ATK", multFactors: 88.8 },
      {
        id: "ES.0",
        name: "Summoning DMG",
        multFactors: 115.44,
      },
      {
        name: "Thundering Retribution (A4)",
        multFactors: { root: 80, scale: 0 },
      },
      {
        name: "Oz's Joint Attack (C6)",
        multFactors: { root: 30, scale: 0 },
      },
    ],
    EB: [
      {
        name: "Falling Thunder",
        multFactors: 208,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Bolts of Downfall",
    },
    ES: {
      name: "Nightrider",
      image: "b/b3/Talent_Nightrider",
    },
    EB: {
      name: "Midnight Phantasmagoria",
      image: "f/ff/Talent_Midnight_Phantasmagoria",
    },
  },
  passiveTalents: [
    { name: "Stellar Predator", image: "2/28/Talent_Stellar_Predator" },
    { name: "Undone Be Thy Sinful Hex", image: "7/75/Talent_Undone_Be_Thy_Sinful_Hex" },
    { name: "Mein Hausgarten", image: "6/60/Talent_Mein_Hausgarten" },
  ],
  constellation: [
    { name: "Gaze of the Deep", image: "7/7c/Constellation_Gaze_of_the_Deep" },
    { name: "Devourer of All Sins", image: "6/69/Constellation_Devourer_of_All_Sins" },
    { name: "Wings of Nightmare", image: "7/7b/Constellation_Wings_of_Nightmare" },
    { name: "Her Pilgrimage of Bleak", image: "7/78/Constellation_Her_Pilgrimage_of_Bleak" },
    { name: "Against the Fleeing Light", image: "5/5f/Constellation_Against_the_Fleeing_Light" },
    { name: "Evernight Raven", image: "4/4e/Constellation_Evernight_Raven" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Nightrider's <Green>Summoning DMG</Green> is increased by <Green b>200%</Green> of <Green>ATK</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyFinalBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C2, "ES.0", "mult_", 200));
      },
    },
  ],
};

export default Fischl as AppCharacter;
