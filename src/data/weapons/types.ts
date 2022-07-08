import { EModAffect } from "@Src/constants";
import type { AllStat, Tracker, Rarity } from "@Src/types";

export interface IWeapon {
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
  applyBuff: (args: ApplyBuffArgs) => void;
  buffs: WeaponBuff[];
  passiveName: string;
  passiveDesc: (args: DescArgs) => {
    core: JSX.Element;
    extra?: JSX.Element[];
  };
}

export interface ApplyBuffArgs {
  refinement: number;
  desc: string;
  tracker: Tracker;
}

interface DescArgs {
  refinement: number;
}
interface WeaponBuff {
  index: number;
  affect: EModAffect;
  applyBuff: (args: ApplyBuffArgs) => void;
  desc: (args: DescArgs) => JSX.Element;
}
