import type { ReactNode } from "react";
import { EModAffect } from "@Src/constants";
import type { Tracker, Rarity, ModifierInput, ArtifactPercentStat } from "./global";
import type {
  CalcCharData,
  PartyData,
  ReactionBonus,
  SkillBonus,
  TotalAttribute,
} from "./calculator";

export type DataWeapon = {
  code: number;
  beta?: boolean;
  name: string;
  rarity: Rarity;
  icon: string;
  mainStatScale: string;
  subStat?: {
    type: ArtifactPercentStat | "em" | "phys";
    scale: string;
  };
  applyBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  applyFinalBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  stackValues?: (args: { refi: number }) => number[];
  passiveName: string;
  passiveDesc: (args: WpDescArgs) => {
    core?: JSX.Element;
    extra?: JSX.Element[];
  };
  buffs?: WeaponBuff[];
};

type ApplyWpPassiveBuffsArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses?: SkillBonus;
  rxnBonuses?: ReactionBonus;
  charData: CalcCharData;
  partyData?: PartyData;
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type ApplyWpBuffArgs = {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  rxnBonuses: ReactionBonus;
  charData: CalcCharData;
  inputs?: ModifierInput[];
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type ApplyWpFinalBuffArgs = {
  totalAttrs: TotalAttribute;
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type WpDescArgs = {
  refi: number;
};

type WeaponBuff = {
  index: number;
  outdated?: boolean;
  affect: EModAffect;
  inputConfig?: {
    labels: string[];
    initialValues: ModifierInput[];
    renderTypes: ("stacks" | "check" | "choices")[];
  };
  applyBuff: (args: ApplyWpBuffArgs) => void;
  applyFinalBuff?: (args: ApplyWpFinalBuffArgs) => void;
  desc: (args: WpDescArgs) => ReactNode;
};
