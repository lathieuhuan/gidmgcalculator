import type { ReactNode } from "react";
import type { Rarity, ModInputConfig, AttributeStat } from "./global";
import type {
  AttackPatternBonus,
  BuffModifierArgsWrapper,
  ModifierInput,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  Tracker,
} from "./calculator";
import type { AppCharacter } from "./character";
import { EModAffect } from "@Src/constants";

export type DefaultAppWeapon = Pick<
  AppWeapon,
  "code" | "beta" | "name" | "rarity" | "icon" | "applyBuff" | "applyFinalBuff" | "buffs"
>;

/**
 * Weapon in app data
 */
export type AppWeapon = {
  code: number;
  beta?: boolean;
  name: string;
  rarity: Rarity;
  icon: string;
  mainStatScale: string;
  subStat?: {
    type: AttributeStat;
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
  charData: AppCharacter;
  partyData?: PartyData;
  refi: number;
  desc: string;
  tracker?: Tracker;
};

type ApplyWpBuffArgs = BuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  refi: number;
  desc?: string;
};

type ApplyWpFinalBuffArgs = BuffModifierArgsWrapper & {
  refi: number;
  desc?: string;
  inputs: ModifierInput[];
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
