import { EModAffect } from "@Src/constants";
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
  beta?: boolean;
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
  buffs?: AbilityBuff[];
  debuffs?: AbilityDebuff[];
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

export type TalentBuff = Record<SkillBonusInfoKey, { desc: string; value: number }>;

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

interface AbilityModifier {
  index: number;
  outdated?: boolean;
  src: string;
  isGranted: (char: CharInfo) => boolean;
}

// BUFFS

// #to-do
type BuffInputRenderType = "select" | "";

interface ApplyBuffArgs {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  selfBuffCtrls: ModifierCtrl[];
  desc: string;
  tracker: Tracker;
}
export interface AbilityBuff extends AbilityModifier {
  desc: () => JSX.Element;
  affect: EModAffect;
  maxs?: (number | null)[];
  inputConfig?: {
    labels: string[];
    selfLabels?: string[];
    initialValues: ModifierInput[]
    renderTypes: BuffInputRenderType[];
  };
  // #to-do
  applyBuff?: (args: ApplyBuffArgs) => void;
  applyFinalBuff?: (args: ApplyBuffArgs) => void;
}

// DEBUFFS

export type DebuffInputRenderType = "absorption" | "text";

// #to-do
interface ApplyDebuffArgs {
  selfDebuffCtrls: ModifierCtrl[];
  desc: string;
  tracker: Tracker;
}
export interface AbilityDebuff extends AbilityModifier {
  desc: () => JSX.Element;
  affect?: EModAffect;
  inputConfig?: {
    labels: string[];
    selfLabels?: string[];
    initialValues: ModifierInput[]
    renderTypes: DebuffInputRenderType[];
  };
  // #to-do
  applyDebuff?: (args: ApplyDebuffArgs) => void;
}
