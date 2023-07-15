import type { UserArtifact, UserSetup, UserWeapon } from "@Src/types";
import calculateAll from "@Src/calculation";
import { findById } from "@Src/utils";
import { appData } from "@Data/index";

export const calculateChosenSetup = (chosenSetup: UserSetup, userWps: UserWeapon[], userArts: UserArtifact[]) => {
  const { char, weaponID, artifactIDs, target, ...rest } = chosenSetup;
  const charData = appData.getCharacter(char.name);
  const weapon = findById(userWps, weaponID);

  if (charData && weapon) {
    const artifacts = artifactIDs.reduce((results: UserArtifact[], ID) => {
      const foundArt = ID ? findById(userArts, ID) : undefined;

      if (foundArt) {
        return results.concat(foundArt);
      }

      return results;
    }, []);

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
