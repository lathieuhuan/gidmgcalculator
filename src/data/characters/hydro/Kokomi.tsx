import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Lightgold } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier, type AttackPatternPath } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Kokomi: DefaultAppCharacter = {
  code: 42,
  name: "Kokomi",
  GOOD: "SangonomiyaKokomi",
  icon: "f/ff/Sangonomiya_Kokomi_Icon",
  sideIcon: "c/c1/Sangonomiya_Kokomi_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Kokomi's <Green>Normal Attack, Charged Attack and Bake-Kurage DMG</Green> are increased based on her{" "}
          <Green>Max HP</Green>.
          <br />• At <Lightgold>A4</Lightgold>, <Green>Normal and Charged Attack DMG Bonus</Green> is further increasd
          based on <Green b>15%</Green> of her <Green>Healing Bonus</Green>.
          <br />• At <Lightgold>C4</Lightgold>, Kokomi's <Green>Normal Attack SPD</Green> is increased by{" "}
          <Green b>10%</Green>.
        </>
      ),
      applyFinalBuff: (obj) => {
        const { char } = obj;
        const fields: AttackPatternPath[] = ["NA.flat", "CA.flat", "ES.flat"];
        const level = finalTalentLv({ ...obj, charData: Kokomi as AppCharacter, talentType: "EB" });

        const buffValues = [4.84, 6.78, 7.1].map((mult, i) => {
          let finalMult = mult * TALENT_LV_MULTIPLIERS[2][level];
          if (i !== 2 && checkAscs[4](char)) {
            finalMult += obj.totalAttr.healB_ * 0.15;
          }
          return applyPercent(obj.totalAttr.hp, finalMult);
        });
        applyModifier(obj.desc, obj.attPattBonus, fields, buffValues, obj.tracker);

        if (checkCons[4](char)) {
          applyModifier(`Self / ${EModSrc.C4}`, obj.totalAttr, "naAtkSpd_", 10, obj.tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          During Nereid's Ascension, Kokomi gains a <Green b>40%</Green> <Green>Hydro DMG Bonus</Green> for 4s after her
          Normal and Charged Attacks heal, or would heal, any party member with 80% or more HP.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "hydro", 40),
    },
  ],
};

export default Kokomi as AppCharacter;
