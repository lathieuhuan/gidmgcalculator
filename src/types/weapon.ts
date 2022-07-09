import type { AllStat, Tracker, Rarity } from "./global";
import { EModAffect } from "@Src/constants";

export type DataWeapon = {
  code: number;
  beta?: boolean;
  name: string;
  icon: string;
  rarity: Rarity;
  mainStatScale: string;
  subStat: {
    type: AllStat;
    scale: string;
  };
  applyBuff: (args: ApplyWpBuffArgs) => void;
  buffs: WeaponBuff[];
  passiveName: string;
  passiveDesc: (args: WpDescArgs) => {
    core: JSX.Element;
    extra?: JSX.Element[];
  };
};

export type ApplyWpBuffArgs = {
  refinement: number;
  desc: string;
  tracker: Tracker;
};

type WpDescArgs = {
  refinement: number;
};

type WeaponBuff = {
  index: number;
  affect: EModAffect;
  applyBuff: (args: ApplyWpBuffArgs) => void;
  desc: (args: WpDescArgs) => JSX.Element;
};
