import type { ReactNode } from "react";
import { EModAffect } from "@Src/constants";
import type { Tracker, Rarity, ArtifactPercentStat, ModInputConfig } from "./global";
import type {
  AttackPatternBonus,
  CharData,
  BuffModifierArgsWrapper,
  ModifierInput,
  PartyData,
  ReactionBonus,
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
  passiveName: string;
  passiveDesc: (args: WeaponDescArgs) => {
    core?: JSX.Element;
    extra?: JSX.Element[];
  };
  buffs?: WeaponBuff[];
};

type ApplyWpPassiveBuffsArgs = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  rxnBonus?: ReactionBonus;
  charData: CharData;
  partyData?: PartyData;
  refi: number;
  desc?: string;
  tracker?: Tracker;
};

type ApplyWpBuffArgs = BuffModifierArgsWrapper & {
  inputs?: ModifierInput[];
  refi: number;
  desc?: string;
};

type ApplyWpFinalBuffArgs = BuffModifierArgsWrapper & {
  refi: number;
  desc?: string;
  inputs?: ModifierInput[];
};

type WeaponDescArgs = {
  refi: number;
};

type WeaponBuff = {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  applyBuff?: (args: ApplyWpBuffArgs) => void;
  applyFinalBuff?: (args: ApplyWpFinalBuffArgs) => void;
  desc: (
    args: WeaponDescArgs & {
      totalAttr: TotalAttribute;
    }
  ) => ReactNode;
};
