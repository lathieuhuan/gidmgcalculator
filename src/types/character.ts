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
} from "./global";
import {
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  SkillBonus,
  SkillBonusInfoKey,
  TotalAttribute,
} from "./calculator";

export type DataCharacter = {
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
};

export type NormalAttackStats = {
  name: string;
  baseMult: number | number[];
  multType: number;
}[];
type NormalAttack = {
  name: string;
  NA: NormalAttackStats;
  CA: NormalAttackStats;
  PA: NormalAttackStats;
  caStamina: number;
};

type Ability = {
  name: string;
  image: string;
};

type GetTalentBuffArgs = {
  char: CharInfo;
  selfBuffCtrls: ModifierCtrl[];
};

export type TalentBuff = Record<SkillBonusInfoKey, { desc: string; value: number }>;

type Skill = Ability & {
  xtraLvAtCons: 3 | 5;
  stats: {
    name: string;
    dmgTypes: [AttackPattern, AttackElement];
    baseSType?: "base_atk" | "atk" | "def" | "hp";
    baseMult: number | number[];
    multType: number;
    getTalentBuff?: (args: GetTalentBuffArgs) => Partial<TalentBuff> | void;
  }[];
};

type ElementalBurst = { energyCost: number } & Skill;

type AbilityModifier = {
  index: number;
  outdated?: boolean;
  src: string;
  isGranted: (char: CharInfo) => boolean;
};

// BUFFS

// #to-do
type BuffInputRenderType = "select" | "";

type ApplyCharBuff = (args: {
  char: CharInfo;
  inputs?: ModifierInput[];
  infusion: FinalInfusion;
  party: Party;
  partyData: PartyData;
  totalAttrs: TotalAttribute;
  skillBonuses?: SkillBonus;
  toSelf: boolean;
  desc: string;
  tracker?: Tracker;
}) => void;

export type AbilityBuff = AbilityModifier & {
  desc: () => JSX.Element;
  affect: EModAffect;
  maxs?: (number | null)[];
  inputConfig?: {
    labels?: string[];
    selfLabels?: string[];
    initialValues: ModifierInput[];
    renderTypes: BuffInputRenderType[];
    maxs?: (number | null)[];
  };
  // #to-do
  applyBuff?: ApplyCharBuff;
  applyFinalBuff?: ApplyCharBuff;
};

// DEBUFFS

export type DebuffInputRenderType = "absorption" | "text";

// #to-do
export type AbilityDebuff = AbilityModifier & {
  desc: () => JSX.Element;
  affect?: EModAffect;
  inputConfig?: {
    labels: string[];
    selfLabels?: string[];
    initialValues: ModifierInput[];
    renderTypes: DebuffInputRenderType[];
  };
  // #to-do
  applyDebuff?: (args: { selfDebuffCtrls: ModifierCtrl[]; desc: string; tracker: Tracker }) => void;
};
