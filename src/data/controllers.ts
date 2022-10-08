import type { Artifact, CalcCharData, PartyData, Weapon } from "@Src/types";
import { findByCode, findByName } from "@Src/utils";
import artifacts from "./artifacts";
import characters from "./characters";
import monsters from "./monsters";
import weapons from "./weapons";

type HasName = { name: string };
type HasCode = { code: number };

export const findCharacter = (char: HasName) => findByName(characters, char.name);

export const findArtifactSet = ({ code }: HasCode) => findByCode(artifacts, code);

export function findArtifactPiece({ code, type }: { type: Artifact } & HasCode) {
  const tgSet = findByCode(artifacts, code)!;
  const { name, icon } = tgSet[type];
  return { beta: tgSet.beta, name, icon };
}

export const findWeapon = ({ code, type }: { type: Weapon } & HasCode) => {
  return findByCode(weapons[type], code);
};

export const findMonster = ({ code }: { code: number }) => findByCode(monsters, code);

export const getCharData = (char: HasName): CalcCharData => {
  const { code, name, vision, nation, weapon, activeTalents } = findCharacter(char)!;
  return {
    code,
    name,
    vision,
    nation,
    weapon,
    EBcost: activeTalents.EB.energyCost,
  };
};

export function getPartyData(party: (HasName | null)[]): PartyData {
  const result = [];
  for (const tm of party) {
    if (tm) {
      const { code, name, nation, vision, activeTalents } = findCharacter(tm)!;
      result.push({ code, name, nation, vision, EBcost: activeTalents.EB.energyCost });
    }
  }
  return result;
}
