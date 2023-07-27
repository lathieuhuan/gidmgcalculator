import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Geo, Green, Lightgold } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Noelle: DefaultAppCharacter = {
  code: 14,
  name: "Noelle",
  icon: "8/8e/Noelle_Icon",
  sideIcon: "1/15/Noelle_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Increases her <Green>Charged Attack DMG</Green> by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 15),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          • Grants Noelle a <Geo>Geo Infusion</Geo> that cannot be overridden.
          <br />• Increases Noelle's <Green>ATK</Green> based on her <Green>DEF</Green>. At <Lightgold>C6</Lightgold>,
          the multipler bonus is increased by <Green b>50%</Green>.
        </>
      ),
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv({
          char,
          charData: Noelle as AppCharacter,
          talentType: "EB",
          partyData,
        });
        const mult = 40 * TALENT_LV_MULTIPLIERS[2][level] + (checkCons[6](char) ? 50 : 0);
        applyModifier(desc, totalAttr, "atk", applyPercent(totalAttr.def, mult), tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
  ],
};

export default Noelle as AppCharacter;
