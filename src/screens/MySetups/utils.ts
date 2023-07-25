import type { UserArtifacts, UserSetup, UserWeapon } from "@Src/types";
import calculateAll from "@Src/calculation";
import { appData } from "@Data/index";

export const calculateChosenSetup = (chosenSetup: UserSetup, weapon: UserWeapon | null, artifacts: UserArtifacts) => {
  const { char, weaponID, artifactIDs, target, ...rest } = chosenSetup;
  const charData = appData.getCharData(char.name);

  if (charData && weapon) {
    const result = calculateAll({ char, weapon, artifacts, ...rest }, target);

    return {
      charData,
      totalAttr: result.totalAttr,
      artAttr: result.artAttr,
      rxnBonus: result.rxnBonus,
      damage: result.dmgResult,
      infusedElement: result.infusedElement,
      innateBuffs: charData.innateBuffs || [],
      buffs: charData.buffs || [],
      debuffs: charData.debuffs || [],
    };
  }
};
