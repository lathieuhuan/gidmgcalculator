import type {
  AttackElement,
  AttackPattern,
  BaseStat,
  Vision,
  Nation,
  Rarity,
  RngPercentStat,
  Weapon,
  CharInfo,
  ModAffect,
  Tracker,
  ModifierInput,
} from "@Src/types";
import {
  ModifierCtrl,
  SkillBonus,
  SkillBonusInfoKey,
  TotalAttribute,
} from "@Store/calculatorSlice/types";

export interface ICharacter {
  code: number;
  name: string;
  icon: string;
  sideIcon: string;
  rarity: Rarity;
  nation: Nation;
  vision: Vision;
  weapon: Weapon;
  stats: (Record<BaseStat, number> & Partial<Record<RngPercentStat, number>>)[];
  activeTalents: {
    NAs: NormalAttack;
    ES: Skill;
    EB: ElementalBurst;
  };
  passiveTalents: Ability[];
  constellation: Ability[];
  buffs?: AbilityModifier[];
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

interface GetTalentBuffArgs {
  char: CharInfo;
  selfBuffCtrls: ModifierCtrl[];
}

export type TalentBuff = Record<
  SkillBonusInfoKey,
  { desc: string; value: number }
>;

interface Skill extends Ability {
  xtraLvAtCons: 3 | 5;
  stats: {
    name: string;
    dmgTypes: [AttackPattern, AttackElement];
    baseSType?: "base_atk" | "atk" | "def" | "hp";
    baseMult: number | number[];
    multType: number;
    getTalentBuff?: (args: GetTalentBuffArgs) => Partial<TalentBuff> | void;
  }[];
}
interface ElementalBurst extends Skill {
  energyCost: number;
}

// #to-do
type ModifierInputType = "select" | "";

interface ApplyBuffArgs {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  selfBuffCtrls: ModifierCtrl[];
  desc: string;
  tracker: Tracker;
}
export interface AbilityModifier {
  index: number;
  src: string;
  desc: () => JSX.Element;
  affect: ModAffect;
  isGranted: (char: CharInfo) => boolean;
  selfLabels?: string[];
  inputs?: ModifierInput[];
  inputTypes?: ModifierInputType[];
  maxs?: (number | null)[];
  // #to-do
  applyBuff?: (args: ApplyBuffArgs) => void;
  applyFinalBuff?: (args: ApplyBuffArgs) => void;
}
