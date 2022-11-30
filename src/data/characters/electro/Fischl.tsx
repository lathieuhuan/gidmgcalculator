import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkCons, talentBuff } from "../utils";

const Fischl: DataCharacter = {
  code: 8,
  name: "Fischl",
  icon: "1/14/Character_Fischl_Thumb",
  sideIcon: "e/ec/Character_Fischl_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weapon: "bow",
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
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Bolts of Downfall",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 44.12 },
        { name: "2-Hit", multBase: 46.78 },
        { name: "3-Hit", multBase: 58.14 },
        { name: "4-Hit", multBase: 57.71 },
        { name: "5-Hit", multBase: 72.07 },
        { name: "Oz's Joint Attack (C1)", multBase: 22, multType: 0 },
      ],
    },
    CA: {
      stats: [
        ...BOW_CAs,
        { name: "Thundering Retribution (A1)", attElmt: "electro", multBase: 189.35, multType: 0 },
      ],
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Nightrider",
      image: "b/b3/Talent_Nightrider",
      xtraLvAtCons: 3,
      stats: [
        { name: "Oz's ATK", multBase: 88.8 },
        {
          name: "Summoning DMG",
          multBase: 115.44,
          getTalentBuff: ({ char }) => talentBuff([checkCons[2](char), "mult", [false, 2], 200]),
        },
        { name: "Thundering Retribution (A4)", multBase: 80, multType: 0 },
        { name: "Oz's Joint Attack (C6)", multBase: 30, multType: 0 },
      ],
      // getExtraStats: () => [
      //   { name: "Oz's Duration", value: "10s" },
      //   { name: "CD", value: "25s" },
      // ],
    },
    EB: {
      name: "Midnight Phantasmagoria",
      image: "f/ff/Talent_Midnight_Phantasmagoria",
      xtraLvAtCons: 5,
      stats: [{ name: "Falling Thunder", multBase: 208 }],
      // getExtraStats: () => [{ name: "CD", value: "15s" }],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Stellar Predator", image: "2/28/Talent_Stellar_Predator" },
    { name: "Undone Be Thy Sinful Hex", image: "7/75/Talent_Undone_Be_Thy_Sinful_Hex" },
    { name: "Mein Hausgarten", image: "6/60/Talent_Mein_Hausgarten" },
  ],
  constellation: [
    { name: "Gaze of the Deep", image: "7/7c/Constellation_Gaze_of_the_Deep" },
    {
      name: "Devourer of All Sins",
      image: "6/69/Constellation_Devourer_of_All_Sins",
    },
    { name: "Wings of Nightmare", image: "7/7b/Constellation_Wings_of_Nightmare" },
    {
      name: "Her Pilgrimage of Bleak",
      image: "7/78/Constellation_Her_Pilgrimage_of_Bleak",
    },
    { name: "Against the Fleeing Light", image: "5/5f/Constellation_Against_the_Fleeing_Light" },
    { name: "Evernight Raven", image: "4/4e/Constellation_Evernight_Raven" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Nightrider's <Green>Summoning DMG</Green> is increased by <Green b>200%</Green> of{" "}
          <Green>ATK</Green>.
        </>
      ),
      isGranted: checkCons[2],
    },
  ],
};

export default Fischl;
