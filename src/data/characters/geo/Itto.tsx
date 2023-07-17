import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Geo, Green } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Itto: DefaultAppCharacter = {
  code: 45,
  name: "Itto",
  GOOD: "AratakiItto",
  icon: "7/7b/Arataki_Itto_Icon",
  sideIcon: "c/c8/Arataki_Itto_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 70,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          <Green>Arataki Kesagiri DMG</Green> is increased by <Green b>35%</Green> of Itto's <Green>DEF</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBonuses, totalAttr }) => {
        calcItemBonuses.push({
          ids: ["CA.0", "CA.1"],
          bonus: talentBuff([true, "flat", [true, 4], applyPercent(totalAttr.def, 35)]),
        });
      },
    },
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Itto's <Green>Charged Attacks</Green> deal <Green b>+70%</Green> <Green>CRIT DMG</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "CA.cDmg_", 70),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          • Grants Itto a <Geo>Geo Infusion</Geo> that cannot be overridden.
          <br />• Increases Itto's <Green>Normal Attack SPD</Green> by <Green b>10%</Green>. Also increases his{" "}
          <Green>ATK</Green> based on his <Green>DEF</Green>.
        </>
      ),
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv({
          char,
          charData: Itto as AppCharacter,
          talentType: "EB",
          partyData,
        });
        const buffValue = applyPercent(totalAttr.def, 57.6 * TALENT_LV_MULTIPLIERS[2][level]);
        applyModifier(desc, totalAttr, ["atk", "naAtkSpd_"], [buffValue, 10], tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When the Raging Oni King state [EB] ends, all nearby party members gain <Green b>20%</Green>{" "}
          <Green>DEF</Green> and <Green b>20%</Green> <Green>ATK</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", ["def_", "atk_"], 20),
    },
  ],
};

export default Itto as AppCharacter;
