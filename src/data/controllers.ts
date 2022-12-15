import type { Artifact, CharData, PartyData, WeaponType } from "@Src/types";
import { findByCode, findByName } from "@Src/utils";
import artifacts from "./artifacts";
import characters from "./characters";
import monsters from "./monsters";
import weapons from "./weapons";

type HasName = { name: string };
type HasCode = { code: number };

export const findCharacter = (char: HasName) => findByName(characters, char.name);

export const findArtifactSet = ({ code }: HasCode) => {
  return code ? findByCode(artifacts, code) : undefined;
};

export function findArtifactPiece({ code, type }: { type: Artifact } & HasCode) {
  const targetSet = findByCode(artifacts, code);

  if (targetSet) {
    const { name, icon } = targetSet[type];
    return { beta: targetSet.beta, name, icon };
  }

  return undefined;
}

export const findWeapon = ({ code, type }: { type: WeaponType } & HasCode) => {
  return code ? findByCode(weapons[type], code) : undefined;
};

export const findMonster = ({ code }: { code: number }) => findByCode(monsters, code);

export const getCharData = (char: HasName): CharData => {
  const { code, name, icon, vision, nation, weaponType, activeTalents } = findCharacter(char)!;
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
