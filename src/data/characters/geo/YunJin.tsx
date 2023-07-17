import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Lightgold, Red } from "@Src/pure-components";
import { applyPercent, countVision, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getNaBonus = ({ toSelf, inputs, char, charData, partyData, totalAttr }: any) => {
  const DEF = toSelf ? totalAttr.def : inputs[0] || 0;
  const level = toSelf
    ? finalTalentLv({ char, charData: YunJin as AppCharacter, talentType: "EB", partyData })
    : inputs[1] || 1;
  let desc = ` / Lv. ${level}`;
  let tlMult = 32.16 * TALENT_LV_MULTIPLIERS[2][level];

  if (toSelf ? checkAscs[4](char) : inputs[2]) {
    const visionCount = countVision(partyData, charData);
    const numOfElmts = Object.keys(visionCount).length;
    const xtraMult = numOfElmts * 2.5 + (numOfElmts === 4 ? 1.5 : 0);

    desc += ` / A4: ${xtraMult}% extra`;
    tlMult += xtraMult;
  }

  return {
    value: applyPercent(DEF, tlMult),
    xtraDesc: desc + ` / ${round(tlMult, 2)}% of ${DEF} DEF`,
  };
};

const YunJin: DefaultAppCharacter = {
  code: 48,
  name: "Yun Jin",
  GOOD: "YunJin",
  icon: "9/9c/Yun_Jin_Icon",
  sideIcon: "f/fb/Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 60,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: ({ charData, partyData }) => {
        const visionCount = countVision(partyData, charData);
        const n = Object.keys(visionCount).length;
        return (
          <>
            The <Green>Normal Attack DMG Bonus</Green> granted by Flying Cloud Flag Formation [~EB] is further increased
            by <Green className={n === 1 ? "" : "opacity-50"}>2.5%</Green>/
            <Green className={n === 2 ? "" : "opacity-50"}>5%</Green>/
            <Green className={n === 3 ? "" : "opacity-50"}>7.5%</Green>/
            <Green className={n === 4 ? "" : "opacity-50"}>11.5%</Green> of Yun Jin's <Green>DEF</Green> when the party
            contains characters of 1/2/3/4 Elemental Types, respectively.
          </>
        );
      },
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: (obj) => (
        <>
          Increases <Green>Normal Attack DMG</Green> based on Yun Jin's <Green>current DEF</Green>.{" "}
          {!obj.toSelf && <Red>Total bonus: {getNaBonus(obj).value}.</Red>}
          <br />• At <Lightgold>A4</Lightgold>, further increases the bonus based on how many element types in the
          party.
          <br />• At <Lightgold>C2</Lightgold>, increases <Green>Normal Attack DMG</Green> by <Green b>15%</Green>.
          <br />• At <Lightgold>C6</Lightgold>, increases <Green>Normal ATK SPD</Green> by <Green b>12%</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Current DEF", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: EModSrc.A4, type: "check", for: "teammate" },
        { label: EModSrc.C2, type: "check", for: "teammate" },
        { label: EModSrc.C6, type: "check", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { toSelf, inputs, char, desc, tracker } = obj;
        const { value, xtraDesc } = getNaBonus(obj);

        applyModifier(desc + xtraDesc, obj.attPattBonus, "NA.flat", value, tracker);

        if (toSelf ? checkCons[2](char) : inputs[3]) {
          applyModifier(desc + ` + ${EModSrc.C2}`, obj.attPattBonus, "NA.pct_", 15, tracker);
        }
        if (toSelf ? checkCons[6](char) : inputs[4]) {
          applyModifier(desc + ` + ${EModSrc.C6}`, obj.totalAttr, "naAtkSpd_", 12, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Yun Jin trigger the Crystallize Reaction, her <Green>DEF</Green> is increased by <Green b>20%</Green> for
          12s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "def_", 20),
    },
  ],
};

export default YunJin as AppCharacter;
