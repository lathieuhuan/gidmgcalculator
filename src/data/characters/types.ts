import type {
  AttackElement,
  AttackPattern,
  BaseStat,
  Element,
  Nation,
  Rarity,
  RngPercentStat,
  Weapon,
} from "@Src/types";

export interface ICharacter {
  id: number;
  name: string;
  icon: string;
  sideIcon: string;
  rarity: Rarity;
  nation: Nation;
  vision: Element;
  weapon: Weapon;
  stats: (Record<BaseStat, number> & Partial<Record<RngPercentStat, number>>)[];
  activeTalents: [NormalAttack, Skill];
}

interface NormalAttack {
  name: string;
  NA: NormalAttackStats;
  CA: NormalAttackStats;
  PA: NormalAttackStats;
  caStamina: number;
}

export type NormalAttackStats = {
  name: string;
  baseMult: number | number[];
  multType: number;
}[];

interface Skill {
  name: string;
  image: string;
  xtraLvAtCons: 3 | 5;
  stats: {
    name: string;
    dmgTypes: [AttackPattern, AttackElement];
    baseSType?: "base_atk" | "atk" | "def" | "hp";
    baseMult: number | number[];
    multType: number;
  }[];
}
