import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Charlotte: DefaultAppCharacter = {
  code: 79,
  name: "Charlotte",
  icon: "d/d2/Charlotte_Icon",
  sideIcon: "8/81/Charlotte_Side_Icon",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  // innateBuffs: [
  //   {
  //     src: EModSrc.A4,
  //     isGranted: checkAscs[4],
  //     description: `For each Fontainian party member other than herself, Charlotte gains a {5%}#[v]
  //     {Healing Bonus}#[k]. For each non-Fontainian party member, Charlotte gains a {5%}#[v] {Cryo DMG Bonus}#[k].`,
  //     applyFinalBuff: (obj) => {
  //       const numOfFontainians = obj.partyData.reduce((total, teammate) => {
  //         return total + (teammate?.nation === "fontaine" ? 1 : 0);
  //       }, 0);
  //       const cryoBonus = (obj.partyData.filter(Boolean).length - numOfFontainians) * 5;
  //       applyModifier(obj.desc, obj.totalAttr, ["healB_", "cryo"], [numOfFontainians * 5, cryoBonus], obj.tracker);
  //     },
  //   },
  // ],
};

export default Charlotte as AppCharacter;
