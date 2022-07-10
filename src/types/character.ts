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
import type {
  CalcCharData,
  DebuffMultiplier,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
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
  activeTalents: [NormalAttacks, ElementalSkill, ElementalBurst];
  passiveTalents: Ability[];
  constellation: Ability[];
  buffs?: AbilityBuff[];
  debuffs?: AbilityDebuff[];
};

export type TalentStatInfo = {
  name: string;
  noCalc?: boolean;
  dmgTypes?: [AttackPattern, AttackElement];
  baseStatType?: "base_atk" | "atk" | "def" | "hp";
  baseMult: number | number[];
  multType: number;
  flat?: {
    base: number;
    type: number
  }
  getTalentBuff?: (args: GetTalentBuffArgs) => TalentBuff | void;
};

type NormalAttacks = {
  name: string;
  stats: TalentStatInfo[];
  caStamina: number;
};

type Ability = {
  name: string;
  image: string;
};

type GetTalentBuffArgs = {
  char: CharInfo;
  partyData: PartyData;
  totalAttrs: TotalAttribute;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
};

export type TalentBuff = Partial<Record<SkillBonusInfoKey, { desc: string; value: number }>>;

type ElementalSkill = Ability & {
  xtraLvAtCons: 3 | 5;
  stats: TalentStatInfo[];
};

type ElementalBurst = ElementalSkill & { energyCost: number };

type AbilityModifier = {
  index: number;
  outdated?: boolean;
  src: string;
  isGranted: (char: CharInfo) => boolean;
};

// BUFFS

// #to-do
type BuffInputRenderType = "select" | "";

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
  applyBuff?: (args: ApplyCharBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharBuffArgs) => void;
};

type ApplyCharBuffArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  rxnBonuses: ReactionBonus;
  char: CharInfo;
  charData: CalcCharData;
  party: Party;
  partyData: PartyData;
  inputs?: ModifierInput[];
  infusion: FinalInfusion;
  toSelf: boolean;
  charBuffCtrls: ModifierCtrl[];
  desc: string;
  tracker?: Tracker;
};

// DEBUFFS

export type DebuffInputRenderType = "absorption" | "text";

export type AbilityDebuff = AbilityModifier & {
  desc: () => JSX.Element;
  affect?: EModAffect;
  inputConfig?: {
    labels: string[];
    selfLabels?: string[];
    initialValues: ModifierInput[];
    renderTypes: DebuffInputRenderType[];
  };
  applyDebuff?: (args: {
    debuffMult: DebuffMultiplier;
    // #to-check
    // selfDebuffCtrls: ModifierCtrl[];
    char?: CharInfo;
    inputs?: ModifierInput[];
    fromSelf: boolean;
    desc?: string;
    tracker?: Tracker;
  }) => void;
};
