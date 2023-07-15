import type { CharData, UserArtifact, UserSetup, UserWeapon } from "@Src/types";
import calculateAll from "@Src/calculation";
import { findAppCharacter } from "@Data/controllers";
import { findById } from "@Src/utils";

export const calculateChosenSetup = (
  chosenSetup: UserSetup,
  userWps: UserWeapon[],
  userArts: UserArtifact[]
) => {
  const { char, weaponID, artifactIDs, target, ...rest } = chosenSetup;
  const data = findAppCharacter(char);
  const weapon = findById(userWps, weaponID);

  if (data && weapon) {
    const artifacts = artifactIDs.reduce((results: UserArtifact[], ID) => {
      const foundArt = ID ? findById(userArts, ID) : undefined;

      if (foundArt) {
        return results.concat(foundArt);
      }

      return results;
    }, []);

    const charData: CharData = {
      code: data.code,
      name: data.name,
      icon: data.icon,
      vision: data.vision,
      nation: data.nation,
      weaponType: data.weaponType,
      EBcost: data.activeTalents.EB.energyCost,
    };

    const result = calculateAll({ char, weapon, artifacts, ...rest }, target, charData);

    return {
      charData,
      totalAttr: result.totalAttr,
      artAttr: result.artAttr,
      rxnBonus: result.rxnBonus,
      damage: result.dmgResult,
      infusedElement: result.infusedElement,
      innateBuffs: data.innateBuffs || [],
      buffs: data.buffs || [],
      debuffs: data.debuffs || [],
    };
  }
};
