import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { round } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const getBuffValue = {
  EB: ({ char, partyData, inputs: [totalEnergy = 0, electroEnergy = 0] }: DescriptionSeedGetterArgs) => {
    // const isshinBonusMults = [0, 0.73, 0.78, 0.84, 0.91, 0.96, 1.02, 1.09, 1.16, 1.23, 1.31, 1.38, 1.45, 1.54];
    const level = finalTalentLv({
      char,
      charData: Raiden as AppCharacter,
      talentType: "EB",
      partyData,
    });
    let extraEnergy = 0;

    if (checkCons[1](char) && electroEnergy <= totalEnergy) {
      extraEnergy += electroEnergy * 0.8 + (totalEnergy - electroEnergy) * 0.2;
    }

    const stackPerEnergy = Math.min(Math.ceil(14.5 + level * 0.5), 20);
    const countResolve = (energyCost: number) => Math.round(energyCost * stackPerEnergy) / 100;
    const stacks = countResolve(totalEnergy + extraEnergy);

    return {
      stackPerEnergy,
      stacks: Math.min(round(stacks, 2), 60),
      extraStacks: countResolve(extraEnergy),
      musouBonus: round(3.89 * TALENT_LV_MULTIPLIERS[2][level], 2),
      isshinBonus: round(0.73 * TALENT_LV_MULTIPLIERS[2][level], 2),
    };
  },
};

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
  dsGetters: [(args) => `${getBuffValue.EB(args).stacks}`, (args) => `${getBuffValue.EB(args).extraStacks}`],
};

export default Raiden as AppCharacter;
