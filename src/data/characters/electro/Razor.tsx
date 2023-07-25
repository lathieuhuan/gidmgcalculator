import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const getEBBuffValue = (level: number) => {
  return Math.min(24 + level * 2 - Math.max(level - 6, 0), 40);
};

const Razor: DefaultAppCharacter = {
  code: 11,
  name: "Razor",
  icon: "b/b8/Razor_Icon",
  sideIcon: "4/4d/Razor_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Raises Razor's <Green>ATK SPD</Green> by{" "}
          <Green b>
            {getEBBuffValue(finalTalentLv({ char, charData: Razor as AppCharacter, talentType: "EB", partyData }))}%
          </Green>
          .
        </>
      ),
      applyBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv({
          char,
          charData: Razor as AppCharacter,
          talentType: "EB",
          partyData,
        });
        applyModifier(desc, totalAttr, "naAtkSpd_", getEBBuffValue(level), tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Picking up an Elemental Orb or Particle increases Razor's <Green>DMG</Green> by <Green b>10%</Green> for 8s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 10),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Increases <Green>CRIT Rate</Green> against opponents with less than 30% HP by <Green b>10%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "cRate_", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Claw and Thunder [ES] (Press) decreases opponents' <Green>DEF</Green> by <Green b>15%</Green> for 7s.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Razor as AppCharacter;
