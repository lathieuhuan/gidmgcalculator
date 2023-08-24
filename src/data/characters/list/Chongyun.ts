import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Chongyun: DefaultAppCharacter = {
  code: 4,
  name: "Chongyun",
  icon: "3/35/Chongyun_Icon",
  sideIcon: "2/20/Chongyun_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Sword, Claymore, or Polearm-wielding characters within Spirit Blade: Chonghua's Layered Frost [ES]
      field have their {Normal ATK SPD}#[gr] increased by {8%}#[b,gr].`,
      isGranted: checkAscs[1],
      applyBuff: ({ totalAttr, charData, desc, tracker }) => {
        if (["sword", "claymore", "polearm"].includes(charData.weaponType))
          applyModifier(desc, totalAttr, "naAtkSpd_", 8, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `Spirit Blade: Cloud-Parting Star {[EB]}#[gr] deals {15%}#[b,gr] more {DMG}#[gr] to opponents with
      a lower percentage of their Max HP remaining than Chongyun.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.A4,
      description: `When the field created by Spirit Blade: Chonghua's Layered Frost [ES] disappears, another spirit
      blade will be summoned to strike nearby opponents and decrease their {Cryo RES}#[gr] by {10%}#[b,gr] for 8s.`,
      isGranted: checkAscs[4],
      applyDebuff: makeModApplier("resistReduct", "cryo", 10),
    },
  ],
};

export default Chongyun as AppCharacter;
