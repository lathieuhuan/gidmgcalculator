import type { ArtifactType, CharData, PartyData, WeaponType } from "@Src/types";
import artifacts from "./artifacts";
import characters from "./characters";
import monsters from "./monsters";
import weapons from "./weapons";

type HasName = { name: string };
type HasCode = { code: number };

export const findDataCharacter = (char: HasName) => {
  return characters.find((character) => character.name === char.name);
};

export const findDataArtifactSet = ({ code }: HasCode) => {
  // no artifact with code 0
  return code ? artifacts.find((artifact) => artifact.code === code) : undefined;
};

export function findDataArtifact({ code, type }: { type: ArtifactType } & HasCode) {
  const targetSet = findDataArtifactSet({ code });

  if (targetSet) {
    const { name, icon } = targetSet[type];
    return { beta: targetSet.beta, name, icon };
  }
  return undefined;
}

export const findDataWeapon = ({ code, type }: { type: WeaponType } & HasCode) => {
  // no weapon with code 0
  return code ? weapons[type].find((weapon) => weapon.code === code) : undefined;
};

export const findMonster = ({ code }: { code: number }) => {
  return monsters.find((monster) => monster.code === code);
};

export const getCharData = (char: HasName): CharData => {
  const { code, name, icon, vision, nation, weaponType, activeTalents } = findDataCharacter(char)!;
  return {
    code,
    name,
    icon,
    vision,
    nation,
    weaponType,
    EBcost: activeTalents.EB.energyCost,
  };
};

export function getPartyData(party: (HasName | null)[]): PartyData {
  const results: PartyData = [];

  for (const char of characters) {
    const foundCharIndex = party.findIndex((teammate) => teammate?.name === char.name);

    if (foundCharIndex !== -1) {
      results[foundCharIndex] = {
        code: char.code,
        icon: char.icon,
        name: char.name,
        nation: char.nation,
        vision: char.vision,
        weaponType: char.weaponType,
        EBcost: char.activeTalents.EB.energyCost,
      };
    }
  }
  for (let i = 0; i < 3; i++) {
    if (!results[i]) {
      results[i] = null;
    }
  }
  return results;
}
