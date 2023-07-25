import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Anemo, Green, Lightgold, Rose } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

const getEBBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, charData: Xiao as AppCharacter, talentType: "EB", partyData });
  return round(58.45 * TALENT_LV_MULTIPLIERS[5][level], 2);
};

const Xiao: DefaultAppCharacter = {
  code: 30,
  name: "Xiao",
  icon: "f/fd/Xiao_Icon",
  sideIcon: "4/49/Xiao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "anemo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Increases Xiao's <Green>Normal / Charged / Plunge Attack DMG</Green> by{" "}
          <Green b>{getEBBuffValue(char, partyData)}%</Green> and grants him an <Anemo>Anemo Infusion</Anemo> that
          cannot be overridden.
          <br />• At <Lightgold>A1</Lightgold>, Xiao's <Green>DMG</Green> is increased by <Green b>5%</Green>, and a
          further <Green b>5%</Green> for every 3s the ability persists. Max <Rose>25%</Rose>
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, char, partyData, inputs, desc, tracker }) => {
        const buffValue = getEBBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, [...NCPA_PERCENTS], buffValue, tracker);

        if (checkAscs[1](char)) {
          applyModifier(desc, attPattBonus, "all.pct_", 5 * (inputs[0] || 0), tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Using Lemniscatic Wind Cycling increases subsequent Lemniscatic Wind Cycling <Green>[ES] DMG</Green> by{" "}
          <Green b>15%</Green>. This effect lasts for 7s, and has a maximum of <Rose>3</Rose> stacks.
        </>
      ),
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Xiao as AppCharacter;
