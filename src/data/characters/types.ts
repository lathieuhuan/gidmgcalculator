import type { CalcChar } from "@Store/calculatorSlice/types";
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
  code: number;
  name: string;
  icon: string;
  sideIcon: string;
  rarity: Rarity;
  nation: Nation;
  vision: Element;
  weapon: Weapon;
  stats: (Record<BaseStat, number> & Partial<Record<RngPercentStat, number>>)[];
  activeTalents: [NormalAttack, Skill, ElementalBurst];
  passiveTalents: Ability[];
  constellation: Ability[];
  buffs?: Modifier[];
}

export type NormalAttackStats = {
  name: string;
  baseMult: number | number[];
  multType: number;
}[];
interface NormalAttack {
  name: string;
  NA: NormalAttackStats;
  CA: NormalAttackStats;
  PA: NormalAttackStats;
  caStamina: number;
}
interface Ability {
  name: string;
  image: string;
}
interface Skill extends Ability {
  xtraLvAtCons: 3 | 5;
  stats: {
    name: string;
    dmgTypes: [AttackPattern, AttackElement];
    baseSType?: "base_atk" | "atk" | "def" | "hp";
    baseMult: number | number[];
    multType: number;
  }[];
}
interface ElementalBurst extends Skill {
  energyCost: number;
}

type ModifierInput = "select";
interface Modifier {
  id: number;
  src: string;
  desc: () => JSX.Element;
  affect: "self" | "teammate" | "party";
  isGranted: (char: CalcChar) => boolean;
  selfLabels?: string[];
  inputs?: (number | string)[];
  inputTypes?: ModifierInput[];
  maxs?: (number | null)[];
}
