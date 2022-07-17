import { EModAffect } from "@Src/constants";
import type {
  AttackElement,
  AttackPattern,
  Vision,
  Nation,
  Rarity,
  Weapon,
  CharInfo,
  Tracker,
  ModifierInput,
  NormalAttack,
  ArtifactPercentStat,
} from "./global";
import type {
  CalcCharData,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  ResistanceReduction,
  AttackPatternBonus,
  AttackPatternInfoKey,
  TotalAttribute,
  AttackElementBonus,
} from "./calculator";
import { ReactNode } from "react";

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
  stats: Array<[number, number, number]>;
  bonusStat: {
    type: AttackElement | ArtifactPercentStat | "em";
    value: number;
  };
  NAsConfig: {
    name: string;
    caStamina: number;
    getExtraStats?: GetExtraStatsFn;
  };
  activeTalents: {
    NA: NormalAttacks;
    CA: NormalAttacks;
    PA: NormalAttacks;
    ES: ElementalSkill;
    EB: ElementalBurst;
    // #to-check
    altSprint?: NoStatsAbility;
  };
  passiveTalents: NoStatsAbility[];
  constellation: NoStatsAbility[];
  buffs?: AbilityBuff[];
  debuffs?: AbilityDebuff[];
};

// extraStats are not calculated into damage results
export type GetExtraStatsFn = (level: number) => {
  name: string;
  value: ReactNode;
}[];

type NormalAttacks = {
  stats: StatInfo[];
};

export type DamageTypes = [AttackPattern | null, AttackElement | "various"];

type GetTalentBuffArgs = {
  char: CharInfo;
  partyData: PartyData;
  totalAttr: TotalAttribute;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
};

export type TalentBuff = Partial<Record<AttackPatternInfoKey, { desc: string; value: number }>>;

export type StatInfo = {
  name: string;
  dmgTypes?: DamageTypes;
  baseMult: number | number[];
  multType: number;
  // if true, stat not listed in-game, baseMult = 0, use getTalentBuff to generate mult
  conditional?: boolean;
  getTalentBuff?: (args: GetTalentBuffArgs) => TalentBuff | void;
  // only on ES / EB
  isHealing?: boolean;
  baseStatType?: "base_atk" | "atk" | "def" | "hp";
  flat?: {
    base: number;
    type: number;
  };
  getLimit?: (args: { totalAttr: TotalAttribute }) => number;
};

type ElementalSkill = {
  name: string;
  image: string;
  xtraLvAtCons: 3 | 5;
  stats: StatInfo[];
  getExtraStats?: GetExtraStatsFn;
};

type ElementalBurst = ElementalSkill & { energyCost: number };

type NoStatsAbility = {
  name: string;
  image: string;
};

type AbilityModifier = {
  index: number;
  outdated?: boolean;
  src: string;
  desc: () => ReactNode;
  isGranted: (char: CharInfo) => boolean;
};

// BUFFS

type InputConfig = {
  labels?: string[];
  selfLabels?: string[];
  initialValues: ModifierInput[];
};

// #to-do
type BuffInputRenderType = "select";

type BuffInputConfig = InputConfig & {
  renderTypes: BuffInputRenderType[];
  maxs?: (number | null)[];
};

export type AbilityBuff = AbilityModifier & {
  affect: EModAffect;
  inputConfig?: BuffInputConfig;
  infuseConfig?: {
    range: NormalAttack[];
    overwritable: boolean;
    isAppliable?: (charData: DataCharacter) => boolean;
  };
  applyBuff?: (args: ApplyCharBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharBuffArgs) => void;
};

type ApplyCharBuffArgs = {
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
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

type DebuffInputConfig = InputConfig & {
  renderTypes: DebuffInputRenderType[];
};

export type AbilityDebuff = AbilityModifier & {
  affect?: EModAffect;
  inputConfig?: DebuffInputConfig;
  applyDebuff?: (args: {
    resistReduct: ResistanceReduction;
    attPattBonus: AttackPatternBonus;
    // #to-check
    // selfDebuffCtrls: ModifierCtrl[];
    char?: CharInfo;
    inputs?: ModifierInput[];
    fromSelf: boolean;
    desc?: string;
    tracker?: Tracker;
  }) => void;
};
