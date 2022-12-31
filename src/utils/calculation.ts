import type { ArtifactSetBonus, CalcArtifacts, CharInfo, PartyData, Talent } from "@Src/types";
import { findCharacter } from "@Data/controllers";
import { findByName } from "./pure-utils";

export function getArtifactSetBonuses(artifacts: CalcArtifacts = []): ArtifactSetBonus[] {
  const sets = [];
  const count: Record<number, number> = {};

  for (const artifact of artifacts) {
    if (artifact) {
      const { code } = artifact;
      count[code] = (count[code] || 0) + 1;

      if (count[code] === 2) {
        sets.push({ code, bonusLv: 0 });
      } else if (count[code] === 4) {
        sets[0].bonusLv = 1;
      }
    }
  }
  return sets;
}

export function totalXtraTalentLv(
  char: CharInfo,
  talentType: Exclude<Talent, "altSprint">,
  partyData?: PartyData
) {
  let result = 0;

  if (talentType === "NAs") {
    if (char.name === "Tartaglia" || (partyData && findByName(partyData, "Tartaglia"))) {
      result++;
    }
  } else {
    const talent = findCharacter(char)!.activeTalents[talentType];
    if (talent.xtraLvAtCons && char.cons >= talent.xtraLvAtCons) {
      result += 3;
    }
  }
  return result;
}

// #to-check cannot use this in data characters (circular dependencies)
export const finalTalentLv = (
  char: CharInfo,
  talentType: Exclude<Talent, "altSprint">,
  partyData?: PartyData
) => {
  return char[talentType] + totalXtraTalentLv(char, talentType, partyData);
};
