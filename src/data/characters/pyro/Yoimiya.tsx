import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Lightgold, Pyro, Rose } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getESBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, charData: Yoimiya as AppCharacter, talentType: "ES", partyData });
  return round(37.91 * TALENT_LV_MULTIPLIERS[5][level], 2);
};

const Yoimiya: DefaultAppCharacter = {
  code: 38,
  name: "Yoimiya",
  icon: "8/88/Yoimiya_Icon",
  sideIcon: "2/2a/Yoimiya_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Yoimiya's <Green>Normal Attack DMG</Green> will be increased by{" "}
          <Green b>{1 + round(getESBuffValue(char, partyData) / 100, 3)}</Green> times and converted to Blazing Arrows
          dealing <Pyro>Pyro DMG</Pyro>.
          <br />• At <Lightgold>A1</Lightgold>, Normal Attacks on hit will increase Yoimiya's{" "}
          <Green>Pyro DMG Bonus</Green> by <Green b>2%</Green> for 3s. Maximum <Rose>10 stacks</Rose>.
        </>
      ),
      inputConfigs: [
        {
          label: "Stacks (A4)",
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: ({ totalAttr, attPattBonus, char, partyData, inputs, desc, tracker }) => {
        const buffValue = getESBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, "NA.multPlus", buffValue, tracker);

        if (checkAscs[1](char)) {
          applyModifier(desc, totalAttr, "pyro", 2 * (inputs[0] || 0), tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          Using Ryuukin Saxifrage [EB] causes nearby party members (excluding Yoimiya) to gain a <Green b>10%</Green>{" "}
          <Green>ATK Bonus</Green> for 15s. A further <Green b>1%</Green> <Green>ATK Bonus</Green> will be added for
          each "Tricks of the Trouble-Maker" [A1] stacks Yoimiya possesses when using Ryuukin Saxifrage.
        </>
      ),
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "atk_", 10 + (inputs[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When an opponent affected by Aurous Blaze [EB] is defeated within its duration, Yoimiya's <Green>ATK</Green>{" "}
          is increased by <Green b>20%</Green> for 20s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "atk_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Yoimiya's <Pyro>Pyro DMG</Pyro> scores a CRIT Hit, she will gain a <Green b>25%</Green>{" "}
          <Green>Pyro DMG Bonus</Green> for 6s. Can work off-field.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "pyro", 25),
    },
  ],
};

export default Yoimiya as AppCharacter;
