import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Nilou: DefaultAppCharacter = {
  code: 60,
  name: "Nilou",
  icon: "5/58/Nilou_Icon",
  sideIcon: "c/c3/Nilou_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that opponent's
      {Hydro RES}#[k] will be decreased by {35%}#[v] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 35),
    },
    {
      index: 1,
      src: EModSrc.C2,
      description: `After a triggered Bloom reaction deals DMG to opponents, their {Dendro RES}#[k] will be decreased by
      {35%}#[v] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "dendro", 35),
    },
  ],
};

export default Nilou as AppCharacter;
