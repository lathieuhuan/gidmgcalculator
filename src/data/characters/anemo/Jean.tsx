import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const Jean: DefaultAppCharacter = {
  code: 2,
  name: "Jean",
  icon: "6/64/Jean_Icon",
  sideIcon: "b/b2/Jean_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 80,
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Increases the pulling speed of Gale Blade [ES] after holding for more than 1s, and increases the{" "}
          <Green>DMG</Green> dealt by <Green b>40%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "ES.pct_", 40),
    },
    {
      index: 1,
      src: EModSrc.C2,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When Jean picks up an Elemental Orb/Particle, all party members have their <Green>Movement SPD</Green> and{" "}
          <Green>ATK SPD</Green> increased by <Green b>15%</Green> for 15s.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Within the field of Dandelion Breeze [EB], all opponents have their <Green>Anemo RES</Green> decreased by{" "}
          <Green b>40%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "anemo", 40),
    },
  ],
};

export default Jean as AppCharacter;
