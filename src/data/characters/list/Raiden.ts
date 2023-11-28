import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

// const getBuffValue = {
//   EB: ({ char, partyData, inputs: [totalEnergy = 0, electroEnergy = 0] }: DescriptionSeedGetterArgs) => {
//     const level = finalTalentLv({
//       char,
//       charData: Raiden as AppCharacter,
//       talentType: "EB",
//       partyData,
//     });
//     let extraEnergy = 0;

//     if (checkCons[1](char) && electroEnergy <= totalEnergy) {
//       extraEnergy += electroEnergy * 0.8 + (totalEnergy - electroEnergy) * 0.2;
//     }

//     const stackPerEnergy = Math.min(Math.ceil(14.5 + level * 0.5), 20);
//     const countResolve = (energyCost: number) => Math.round(energyCost * stackPerEnergy) / 100;
//     const stacks = countResolve(totalEnergy + extraEnergy);

//     return {
//       stackPerEnergy,
//       stacks: Math.min(round(stacks, 2), 60),
//       extraStacks: countResolve(extraEnergy),
//       musouBonus: round(3.89 * TALENT_LV_MULTIPLIERS[2][level], 2),
//       isshinBonus: round(0.73 * TALENT_LV_MULTIPLIERS[2][level], 2),
//     };
//   },
// };

const Raiden: DefaultAppCharacter = {
  code: 40,
  name: "Raiden Shogun",
  icon: "2/24/Raiden_Shogun_Icon",
  sideIcon: "c/c7/Raiden_Shogun_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "polearm",
  EBcost: 90,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  // dsGetters: [(args) => `${getBuffValue.EB(args).stacks}`, (args) => `${getBuffValue.EB(args).extraStacks}`],
};

export default Raiden as AppCharacter;
