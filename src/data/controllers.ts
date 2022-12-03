import type { Artifact, CharData, PartyData, Weapon } from "@Src/types";
import { findByCode, findByName, pickProps } from "@Src/utils";
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

export const findWeapon = ({ code, type }: { type: Weapon } & HasCode) => {
  return code ? findByCode(weapons[type], code) : undefined;
};

export const findMonster = ({ code }: { code: number }) => findByCode(monsters, code);

export const getCharData = (char: HasName): CharData => {
  const { code, name, icon, vision, nation, weapon, activeTalents } = findCharacter(char)!;
  return {
    code,
    name,
    icon,
    vision,
    nation,
    weapon,
    EBcost: activeTalents.EB.energyCost,
  };
};

export function getPartyData(party: (HasName | null)[]): PartyData {
  return party.map((teammate) => {
    if (teammate) {
      const data = findCharacter(teammate);

      if (data) {
        return {
          code: data.code,
          icon: data.icon,
          name: data.name,
          nation: data.nation,
          vision: data.vision,
          weapon: data.weapon,
          EBcost: data.activeTalents.EB.energyCost,
        };
      }
    }

    return null;
  });
}
