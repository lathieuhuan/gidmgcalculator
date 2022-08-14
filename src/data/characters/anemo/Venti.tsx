import type { ApplyCharDebuffFn, DataCharacter, Vision } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { checkCons } from "../utils";

const applyC2Debuff: ApplyCharDebuffFn = ({ resistReduct, desc, tracker }) => {
  applyModifier(desc, resistReduct, ["phys", "anemo"], 12, tracker);
};

const Venti: DataCharacter = {
  code: 22,
  name: "Venti",
  icon: "8/8d/Character_Venti_Thumb",
  sideIcon: "f/f7/Character_Venti_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "anemo",
  weapon: "bow",
  stats: [
    [820, 20, 52],
    [2127, 53, 135],
    [2830, 71, 180],
    [4234, 106, 269],
    [4734, 118, 301],
    [5446, 136, 346],
    [6112, 153, 388],
    [6832, 171, 434],
    [7331, 183, 465],
    [8058, 201, 512],
    [8557, 214, 543],
    [9292, 232, 590],
    [9791, 245, 622],
    [10531, 263, 669],
  ],
  bonusStat: { type: "er", value: 8 },
  NAsConfig: { name: "Divine Marksmanship" },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit (1/2)", baseMult: 20.38 },
        { name: "2-Hit", baseMult: 44.38 },
        { name: "3-Hit", baseMult: 52.37 },
        { name: "4-Hit (1/2)", baseMult: 26.06 },
        { name: "5-Hit", baseMult: 50.65 },
        { name: "6-Hit", baseMult: 70.95 },
      ],
    },
    CA: {
      stats: [
        { name: "Aimed Shot", baseMult: 43.86 },
        { name: "Fully-charged Aimed Shot", dmgTypes: ["CA", "anemo"], baseMult: 124, multType: 8 },
      ],
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Skyward Sonnet",
      image: "1/17/Talent_Skyward_Sonnet",
      xtraLvAtCons: 5,
      stats: [
        { name: "Press DMG", baseMult: 276 },
        { name: "Hold DMG", baseMult: 380 },
      ],
      // getExtraStats: () => [
      //   { name: "Press CD", value: "6s" },
      //   { name: "Hold CD", value: "15s" },
      // ],
    },
    EB: {
      name: "Wind's Grand Ode",
      image: "3/32/Talent_Wind%27s_Grand_Ode",
      xtraLvAtCons: 3,
      stats: [
        { name: "DoT", baseMult: 37.6 },
        { name: "Addition Elemental DMG", dmgTypes: ["EB", "various"], baseMult: 18.8 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "8s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Embrace of Winds", image: "7/70/Talent_Embrace_of_Winds" },
    { name: "Stormeye", image: "b/b2/Talent_Stormeye" },
    { name: "Windrider", image: "0/05/Talent_Windrider" },
  ],
  constellation: [
    { name: "Splitting Gales", image: "5/5b/Constellation_Splitting_Gales" },
    { name: "Breeze of Reminiscence", image: "1/1c/Constellation_Breeze_of_Reminiscence" },
    { name: "Ode to Thousand Winds", image: "5/53/Constellation_Ode_to_Thousand_Winds" },
    { name: "Hurricane of Freedom", image: "e/ee/Constellation_Hurricane_of_Freedom" },
    { name: "Concerto dal Cielo", image: "b/b7/Constellation_Concerto_dal_Cielo" },
    { name: "Storm of Defiance", image: "1/1d/Constellation_Storm_of_Defiance" },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.C4,
      desc: () => (
        <>
          When Venti picks up an Elemental Orb or Particle, he receives a <Green b>25%</Green>{" "}
          <Green>Anemo DMG Bonus</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "anemo", 25),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModifierSrc.C2,
      desc: () => (
        <>
          Skyward Sonnet decreases opponents' <Green>Anemo RES</Green> and{" "}
          <Green>Physical RES</Green> by <Green b>12%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: applyC2Debuff,
    },
    {
      index: 1,
      src: EModifierSrc.C2,
      desc: () => (
        <>
          Opponents launched by Skyward Sonnet suffer an additional <Green b>12%</Green>{" "}
          <Green>Anemo RES</Green> and <Green>Physical RES</Green> decrease while airborne.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: applyC2Debuff,
    },
    {
      index: 2,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          Wind's Grand Ode decreases opponents' <Green>Anemo RES</Green> and <Green>RES</Green>{" "}
          towards the <Green>Element absorbed</Green> by <Green b>20%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      inputConfig: {
        selfLabels: ["Element Absorbed"],
        labels: ["Element Absorbed"],
        renderTypes: ["anemoable"],
        initialValues: ["pyro"],
      },
      applyDebuff: ({ resistReduct, inputs, desc, tracker }) => {
        applyModifier(desc, resistReduct, ["anemo", inputs![0] as Vision], 20, tracker);
      },
    },
  ],
};

export default Venti;
