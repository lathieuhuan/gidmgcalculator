import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getEBBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, charData: Yanfei as AppCharacter, talentType: "EB", partyData });
  return round(33.4 * TALENT_LV_MULTIPLIERS[5][level], 1);
};

const Yanfei: DefaultAppCharacter = {
  code: 34,
  name: "Yanfei",
  icon: "5/54/Yanfei_Icon",
  sideIcon: "b/b3/Yanfei_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 3,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Increases <Green>Charged Attack DMG</Green> by <Green b>{getEBBuffValue(char, partyData)}%</Green>.
        </>
      ),
      applyBuff: ({ attPattBonus, char, partyData, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.pct_", getEBBuffValue(char, partyData), tracker);
      },
    },
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Yanfei's Charged Attack consumes Scarlet Seals, each Scarlet Seal will increase her{" "}
          <Green>Pyro DMG Bonus</Green> by <Green b>5%</Green> for 6s.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "pyro", 5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Increases Yanfei's <Green>Charged Attack CRIT Rate</Green> by <Green b>20%</Green> against enemies below 50%
          HP.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate_", 20),
    },
  ],
};

export default Yanfei as AppCharacter;
